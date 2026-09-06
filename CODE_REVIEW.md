# CELA Website — Code Logic Review & Recommendations

**Scope:** Angular 18 standalone SPA (Appwrite BaaS: auth, DB, storage) · ~3,300 lines across 19 components · Tailwind CSS · GitHub Pages deploy
**Reviewed:** full `src/` tree, `scripts/setup-appwrite.js`, `.github/workflows/deploy.yml`, configs

---

## 1. Architecture summary

```
main.ts → AppComponent (navbar + router-outlet + footer)
├── Public routes:  home (hero/about/services/projects/team/publications/contact),
│                   publications, news/:id, publication/:id, project/:id, login
├── Admin routes:   admin/add, admin/team, admin/edit-{project,news,publication}/:id  (authGuard)
├── DataService     — single service: auth + DB CRUD + storage upload
└── TranslationService — single-language (ua) dictionary + signal-based `t`
```

Overall the code is clean, readable, and consistently structured (signals, `inject()`, OnPush on some roots, `@if/@for` control flow). The issues below are mostly **logic gaps, dead paths, and duplication** rather than style problems.

---

## 2. 🔴 Critical logic bugs

### 2.1 Silent data truncation — Appwrite `listDocuments` defaults to 25 documents
Every list getter (`getProjects`, `getNews`, `getPublications`, `getTeam`) calls `listDocuments` **without a limit**. Appwrite's default response cap is **25 documents** ([docs](https://appwrite.io/docs/references/0.15.x/client-web/databases)), so once any collection grows past 25 items, the site will silently show only the newest 25 — with no error anywhere.

**Fix** (and add real pagination for the publications page):
```ts
async getProjects(): Promise<any[]> {
  const res = await this.databases.listDocuments(dbId, collId, [
    Query.orderDesc('createdAt'),
    Query.limit(100),          // max per request is 100
  ]);
  return res.documents;
}
```

### 2.2 Project `type` enum mismatch between create and edit forms
- `admin-project.component.ts` (create): `<option value="donor">` / `<option value="probono">`
- `admin-edit-project.component.ts` (edit): `<option value="donor">` / `<option value="commercial">`

Editing a **probono** project opens the form with "donor" selected; saving without touching the select silently converts it. The card template only checks `type === 'donor' ? donors : probono`, so "commercial" renders with the Pro Bono badge too.

**Fix:** one shared constant, e.g. `export const PROJECT_TYPES = ['donor', 'probono'] as const;` used by both forms and the card renderer.

### 2.3 Contact email mismatch (live bug)
`contact.component.ts`:
```html
<a href="mailto:cepa.org@gmail.com" ...>info@cela.org.ua</a>
```
The visible address and the actual `mailto:` target differ — clicks compose to a Gmail inbox. (The last commit fixed the footer mailto, but contact was missed.)

### 2.4 Placeholder links shipped in templates
`https://forms.gle/REPLACE_WITH_REAL_FORM` is live in `navbar.component.ts` (desktop CTA + mobile menu) and `contact.component.ts`. Anyone clicking "Підтримати" / "Надіслати повідомлення" hits a dead Google Form.

**Fix:** move both to `environment.ts` (`supportFormUrl`, `contactEmail`) so config lives in one place.

### 2.5 Template reads schema fields that don't exist
- `publications.component.ts` renders `item.fileUrl` ("Завантажити PDF") and `item.content` — but `setup-appwrite.js` defines Publications as `title/category/desc/link/createdAt` only. Both branches are dead code; the PDF download button can never appear.
- `article-details.component.ts` renders `sanitizedDetails` from `data.details` — but **neither News nor Publications has a `details` attribute** (only Projects do). The rich-text branch of the article page is dead for news/publications.

**Fix:** either add the attributes to the schema + admin forms, or delete the dead template branches. Right now the schema, admin forms, and templates tell three different stories.

### 2.6 CI deletes `package-lock.json` on every build
```yaml
run: |
  rm -f package-lock.json
  npm install
```
This makes builds non-reproducible (any new compatible release of any dependency changes the artifact) and defeats the npm cache. **Fix:** commit a correct lockfile and use `npm ci`; if the lockfile is out of sync, fix it locally (`npm install` once, commit) — not in CI. Also change `cache-dependency-path: package-lock.json`.

### 2.7 GitHub Pages + `PathLocationStrategy` = 404 on deep links
Routes like `/project/some-slug` or `/publications` will 404 on refresh/direct visit/share, because GitHub Pages has no SPA fallback (`index.html` is only served at `/`).

**Fix (pick one):**
1. Copy `index.html` → `404.html` in the deploy artifact (classic Pages SPA trick), or
2. `provideRouter(routes, withHashLocation())`, or
3. Move hosting somewhere with rewrite rules (Firebase/Netlify/Cloudflare Pages).

---

## 3. 🟠 Medium issues

### 3.1 Slug logic is duplicated *and* inconsistent
`DataService.generateSlugFromTitle()` exists, but `admin-project.component.ts` and `admin-edit-project.component.ts` each re-implement the same Ukrainian transliteration map inline. Worse, they differ:
- service version: `.replace(/^-|-$/g, '')` (trims edge hyphens)
- component versions: don't trim → slugs like `-моя-сторінка-` become `--storinka-`

Also there is **no uniqueness guarantee** — two projects titled the same produce the same slug, and `getProjectBySlug(..., Query.limit(1))` silently returns an arbitrary one.

**Fix:** delete both inline copies, call the service method, and add a **unique index on `slug`** in Appwrite (handle the conflict on create by appending `-2`, `-3`, …).

### 3.2 The ID-vs-slug heuristic is fragile
```ts
if (id.length === 20 && !id.includes('-')) { getProjectById(id) } else { getProjectBySlug(id) }
```
This exists to avoid a 404-log for slug lookups. A slug that happens to be 20 chars with no hyphens breaks it, and it's duplicated in two components.

**Fix:** put a `resolveProject(idOrSlug)` method in `DataService` (try slug query first — a failed `Query.equal` on a missing index isn't an error; fall back to `getDocument`). One implementation, tested once.

### 3.3 Storage orphans & no delete paths
- `onSubmitProject` uploads main + gallery files **before** `createProject`; if the doc call fails, the uploaded files are orphaned forever.
- Replacing an image in the edit forms never deletes the old file.
- `DataService` has `deleteTeamMember` but **no** `deleteProject` / `deleteNews` / `deletePublication` — content can never be removed.

**Fix:** store the storage `$id` alongside the URL (or derive it), and add `deleteCollectionFile()` called on replace/abandon; add delete methods + confirm UI for all collections.

### 3.4 Client-supplied `createdAt` for ordering
`createProject/addNews/addPublication/addTeamMember` set `createdAt = new Date().toISOString()` on the client. Clock skew reorders the site's lists.

**Fix:** rely on Appwrite's built-in `$createdAt` and drop the custom attribute (or at least keep it server-side via a function). Same for `news.date` defaulting.

### 3.5 `authGuard` does a network call on every navigation and loses the return URL
Every guarded navigation awaits `account.get()`. Offline users get bounced to login even with a valid session cookie. And after login the user is always sent to `/admin/add`.

**Fix:** cache the session (a signal in an `AuthService`, refreshed once per app boot), and implement the standard `returnUrl` pattern:
```ts
router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
```

### 3.6 `DataService` swallows errors → "empty" states lie
Every read catches and returns `[]`/`null`. A network outage renders "Наразі активні проєкти відсутні" — indistinguishable from truly empty data.

**Fix:** return a result object (`{ data, error }`) or let the error propagate to components that set `error` signals and render a retry state.

### 3.7 Heavy duplication in admin components
The gallery manager (FileReader previews, move/remove, upload-on-submit), the contenteditable toolbar + `onPaste`, the slug generator, and the "is current user logged in" check are copy-pasted across `admin-project`, `admin-edit-project`, `admin-team` (2× gallery logic), and the three edit forms.

**Fix:** extract a `GalleryPickerComponent`, a `RichTextEditorComponent`, and an `AuthService.currentUser` signal. This removes ~300–400 lines and makes the storage-orphan fix (3.3) a one-place change.

### 3.8 `document.execCommand` is deprecated
The rich-text toolbars rely on it. It still works in browsers but is formally deprecated with no guaranteed future. The paste handler also strips **all** formatting to plain text (double newlines are not restored as paragraphs, despite the comment). Consider a lightweight editor (e.g. TipTap) or, minimally, wrap it behind the `RichTextEditorComponent` so it can be swapped.

### 3.9 Sequential awaits delay page render
`ProjectDetailsComponent.ngOnInit` / `ArticleDetailsComponent.ngOnInit`:
```ts
const user = await this.data.getCurrentUser();   // blocks content!
const id = ...; data = await this.data.get...();
```
The edit-button check blocks the article/project fetch by a full round trip. Run them in parallel (`const [user, data] = await Promise.all([...])`) or make the user check fire-and-forget. Also, `scrollPositionRestoration: 'top'` in `main.ts` already handles `window.scrollTo(0,0)` — that call is redundant.

### 3.10 Login error-check precedence
```ts
if (error?.type === 'user_session_already_exists' || error?.code === 401 && errMsg.includes('session is active'))
```
`&&` binds tighter than `||` — it works, but it reads like a bug. Add parentheses, or better: match on `error.type` only (Appwrite error types are stable; message strings are locale-dependent).

---

## 4. 🟡 Code quality & smaller items

| Item | Where | Suggestion |
|---|---|---|
| Everything is `any` | `DataService`, all components | Add `models.ts` with `Project`, `NewsItem`, `Publication`, `TeamMember` interfaces; type the service and templates (`strictTemplates` is already on — you're paying for it) |
| God service | `DataService` = auth + 4 collections + storage | Split into `AuthService` + per-collection repos; keeps the guard and components small |
| Double sanitization | `article-details`, `project-details` | `sanitizer.sanitize(...)` into a var bound via `[innerHTML]` — Angular sanitizes innerHTML bindings again anyway. Pick one layer (just `[innerHTML]` is fine) |
| Fragile HTML sniffing | `details.includes('<') && details.includes('>')` | A plain-text post containing `<3 >…` takes the HTML path. Store an explicit `isHtml` flag at save time instead |
| `alert()` / `confirm()` | all admin flows | Replace with inline toasts/dialogs — alerts block the UI thread and look unfinished |
| Images have no `alt` | every `<img [src]>` | `alt="{{ project.title }}"` etc. — accessibility + SEO |
| No route lazy-loading | `app.routes.ts` | Admin routes are ideal for `loadComponent: () => import(...)` — public bundle shrinks, admin code isn't shipped to visitors |
| Team order | `getTeam()` | `orderDesc('createdAt')` puts the newest hire first; likely you want insertion order (asc) or an explicit `order` attribute |
| Missing prod environment | `src/environments/` | Only one file, `production: false` never checked. Add `environment.prod.ts` + file replacement in `angular.json` |
| `src/assets` referenced but missing | `angular.json` assets | Remove the entry or create the dir — some CLI versions fail/warn the build |
| `setup-appwrite.js` not idempotent | scripts | Creates a **new** database + bucket every run (new IDs to copy each time). Re-run should reuse by fixed IDs or look up by name |
| No tests | repo | Playwright + Karma are devDeps but zero specs exist. Highest-value first tests: slug generation, publications filter logic (`дайджест` substring match on a translated label is fragile — filter by a stable `category` enum instead), and one e2e smoke route |
| Single-language TranslationService | `translation.service.ts` | Fine for now, but `Language = 'ua'` type + admin strings hardcoded in components means i18n later = big sweep. Consider at least moving admin strings into the dictionary |
| Session-exists handling | `login.component.ts` | Navigating to admin on `user_session_already_exists` without verifying *whose* session it is — fine for single-admin, but worth a comment |

---

## 5. Priority roadmap

| # | Action | Effort | Impact |
|---|---|---|---|
| 1 | Fix mailto mismatch + replace `forms.gle` placeholder (env config) | 15 min | Users can actually reach you |
| 2 | `Query.limit(100)` on all list getters | 15 min | Prevents silent content loss |
| 3 | SPA fallback for GitHub Pages (`404.html`) | 30 min | Shared/refreshed links stop 404ing |
| 4 | Unify project `type` enum | 30 min | Stops silent data corruption on edit |
| 5 | `npm ci` in CI, keep lockfile | 30 min | Reproducible builds |
| 6 | Delete dead branches (`fileUrl`, `content`) or add schema attrs | 1 h | Honest UI |
| 7 | Unique slug index + shared slug util | 1–2 h | Correct routing |
| 8 | Extract `AuthService` + `GalleryPicker` + `RichTextEditor` | 1 day | −400 LOC, enables fixes below |
| 9 | Delete endpoints for projects/news/publications + storage cleanup | 1 day | Content lifecycle |
| 10 | Error states instead of swallowed errors; lazy admin routes; models | 1–2 days | Robustness, DX |

---

## 6. What's already good

- Consistent standalone components with `inject()` and signals; `@if/@for` control flow with proper `track`.
- `OnPush` on container components; `computed()` used for filtering and merged image lists (dedupe via `Set` — nice).
- Guard + client double-check on admin pages; Appwrite permissions use `Role.users()` for writes with the registration warning in the setup script.
- Transliteration-based slugs with a fallback when the title yields nothing.
- Strict TypeScript (`strictTemplates` included) — the compiler is configured to catch template drift; the `any`s are the main thing standing in its way.
- Sensible security headers in `index.html`; `rel="noopener noreferrer"` on external links.
