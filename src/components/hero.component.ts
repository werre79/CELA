import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- HERO: h-screen, flex column, nothing overlaps -->
    <section class="relative overflow-hidden flex flex-col"
             style="height: 100dvh; min-height: 600px; background-color: #0E0F13;">

      <!-- ══ BACKGROUND LAYER (pointer-events: none, z-0) ══ -->
      <div class="hero-canvas" aria-hidden="true">
        <div class="hero-blob-1"></div>
        <div class="hero-blob-2"></div>
        <div class="hero-blob-3"></div>
        <div class="hero-grid"></div>
        <div class="hero-grain"></div>
        <div class="hero-spine"></div>

        <!-- Top-right concentric arcs -->
        <div class="absolute top-0 right-0 w-[280px] h-[280px] pointer-events-none overflow-hidden">
          <div class="absolute top-0 right-0 w-full h-full"
               style="background: linear-gradient(225deg, rgba(196,98,45,0.05) 0%, transparent 55%);"></div>
          <div class="absolute -top-14 -right-14 w-[240px] h-[240px] rounded-full border border-white/[0.04]"></div>
          <div class="absolute -top-6 -right-6 w-[180px] h-[180px] rounded-full border border-white/[0.04]"></div>
          <div class="absolute top-2 right-2 w-[120px] h-[120px] rounded-full border border-white/[0.04]"></div>
        </div>

        <!-- Dot cluster — bottom-right corner (away from text) -->
        <div class="absolute bottom-14 right-14 opacity-[0.09] hidden lg:grid grid-cols-5 gap-2.5" aria-hidden="true">
          <div *ngFor="let d of dots" class="w-[3px] h-[3px] rounded-full bg-white"></div>
        </div>
      </div>

      <!-- ══ MAIN CONTENT AREA ══
           pt-24 → clears the fixed navbar (≈80px pill + 20px gap)
           pb-4  → small bottom padding
           flex-1 → takes remaining space between navbar clearance and bottom bar
      -->
      <div class="relative z-20 flex-1 flex flex-col justify-center
                  pt-24 sm:pt-28 pb-4
                  max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16">

        <!-- Badge -->
        <div class="hero-badge flex items-center gap-3 mb-4 sm:mb-5">
          <span class="h-px flex-shrink-0 w-8 bg-terra-600/70"></span>
          <span class="text-[10px] font-sans font-bold uppercase tracking-[0.26em] text-terra-500">
            {{ ts.t().hero.badge }}
          </span>
          <span class="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-terra-600 opacity-50"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-terra-700"></span>
          </span>
        </div>

        <!-- H1 — scaled to fit in viewport alongside everything else -->
        <h1 class="hero-title mb-5 sm:mb-7 overflow-hidden">
          <span class="hero-title-line1 block font-serif font-normal leading-[1.08] tracking-tight"
                style="color: #E8E4DE; font-size: clamp(1.9rem, 5vw, 4.2rem);">
            {{ ts.t().hero.titleStart }}
          </span>
          <span class="hero-title-line2 block font-serif italic font-bold leading-[1.05] terra-text"
                style="font-size: clamp(2.4rem, 6.5vw, 5.5rem); margin-top: -0.02em;">
            {{ ts.t().hero.titleEnd }}
          </span>
        </h1>

        <!-- Description + CTAs row -->
        <div class="hero-body flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-12">

          <p class="font-sans font-light text-sm sm:text-base leading-relaxed text-stone-400 max-w-[400px]">
            {{ ts.t().hero.description }}
          </p>

          <div class="hero-ctas flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <!-- TODO: REPLACE WITH ACTUAL DATA (Google Form link or Contact link) -->
            <a href="https://forms.gle/REPLACE_WITH_REAL_FORM"
               target="_blank" rel="noopener noreferrer"
               id="hero-cta-contact"
               class="btn-terra inline-flex items-center justify-center gap-2
                      px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap">
              {{ ts.t().hero.btnContact }}
              <span class="material-icons-round" style="font-size:14px;">open_in_new</span>
            </a>

            <button (click)="scrollTo('projects')"
                    id="hero-cta-projects"
                    class="btn-ghost inline-flex items-center justify-center gap-2
                           px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap">
              {{ ts.t().nav.projects }}
              <span class="material-icons-round" style="font-size:14px;">south</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ══ MARQUEE STRIPE — positioned precisely, doesn't float over content ══ -->
      <div class="relative z-20 w-full overflow-hidden pointer-events-none
                  border-t border-white/[0.06]"
           aria-hidden="true">
        <div class="hero-marquee-track py-2.5 whitespace-nowrap text-[10px] font-sans font-semibold uppercase
                    tracking-[0.22em] text-white/[0.12] select-none">
          <span *ngFor="let item of marqueeItems" class="mx-8">{{ item }}</span>
          <span *ngFor="let item of marqueeItems" class="mx-8">{{ item }}</span>
        </div>
      </div>

      <!-- ══ BOTTOM BAR — scroll hint + latest project ══ -->
      <div class="hero-bottom relative z-20 w-full max-w-7xl mx-auto
                  px-6 sm:px-10 lg:px-16 py-3 sm:py-4
                  flex items-center justify-between gap-4">

        <!-- Scroll indicator -->
        <div class="flex items-center gap-2.5">
          <div class="flex flex-col gap-[3px]">
            <div class="w-5 h-px bg-terra-600/50"></div>
          </div>
          <span class="text-[9px] text-stone-600 uppercase tracking-[0.2em] font-semibold">
            {{ ts.t().hero.scroll }}
          </span>
        </div>

        <!-- Latest project link (only if data loaded) -->
        @if (latestProject()) {
          <a [routerLink]="['/project', latestProject().slug || latestProject().$id]"
             class="hidden md:inline-flex items-center gap-3 group">
            <div class="text-right">
              <span class="block text-[9px] text-stone-600 uppercase tracking-[0.18em] mb-0.5">
                {{ ts.t().hero.lastProject.label || 'Останній проєкт' }}
              </span>
              <span class="block text-xs text-stone-400 font-serif italic group-hover:text-terra-400 transition-colors duration-300">
                {{ latestProject().title }}
              </span>
            </div>
            <span class="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center
                         group-hover:border-terra-600/40 group-hover:bg-terra-900/20 transition-all duration-300">
              <span class="material-icons-round text-stone-600 group-hover:text-terra-400 transition-colors"
                    style="font-size:12px;">east</span>
            </span>
          </a>
        }
      </div>
    </section>
  `
})
export class HeroComponent implements OnInit {
  ts = inject(TranslationService);
  data = inject(DataService);

  latestProject = signal<any>(null);
  dots = Array.from({ length: 25 });

  get marqueeItems(): string[] {
    return [
      'Економіко-правова аналітика', '·',
      'Незалежна експертиза', '·',
      'Стійкість України', '·',
      'Публікації та дослідження', '·',
      'Донорські програми', '·',
      'Pro Bono', '·',
    ];
  }

  async ngOnInit() {
    try {
      const projects = await this.data.getProjects();
      if (projects?.length) this.latestProject.set(projects[0]);
    } catch { /* optional */ }
  }



  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
