import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProjectDetailsComponent } from './components/project-details.component';
import { LoginComponent } from './components/login.component';
import { PublicationsComponent } from './components/publications.component';
import { ArticleDetailsComponent } from './components/article-details.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'news/:id', component: ArticleDetailsComponent },
  { path: 'publication/:id', component: ArticleDetailsComponent },
  { path: 'project/:id', component: ProjectDetailsComponent },
  { path: 'login', component: LoginComponent },

  // Admin area is lazy-loaded: visitors never download admin code.
  { path: 'admin/add', loadComponent: () => import('./components/admin-project.component').then(m => m.AdminProjectComponent), canActivate: [authGuard] },
  { path: 'admin/team', loadComponent: () => import('./components/admin-team.component').then(m => m.AdminTeamComponent), canActivate: [authGuard] },
  { path: 'admin/edit-project/:id', loadComponent: () => import('./components/admin-edit-project.component').then(m => m.AdminEditProjectComponent), canActivate: [authGuard] },
  { path: 'admin/edit-news/:id', loadComponent: () => import('./components/admin-edit-news.component').then(m => m.AdminEditNewsComponent), canActivate: [authGuard] },
  { path: 'admin/edit-publication/:id', loadComponent: () => import('./components/admin-edit-publication.component').then(m => m.AdminEditPublicationComponent), canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];
