import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProjectDetailsComponent } from './components/project-details.component';
import { AdminProjectComponent } from './components/admin-project.component';
import { LoginComponent } from './components/login.component';
import { AdminTeamComponent } from './components/admin-team.component';
import { PublicationsComponent } from './components/publications.component';
import { ArticleDetailsComponent } from './components/article-details.component';
import { AdminEditProjectComponent } from './components/admin-edit-project.component';
import { AdminEditNewsComponent } from './components/admin-edit-news.component';
import { AdminEditPublicationComponent } from './components/admin-edit-publication.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'news/:id', component: ArticleDetailsComponent },
  { path: 'publication/:id', component: ArticleDetailsComponent },
  { path: 'project/:id', component: ProjectDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/add', component: AdminProjectComponent, canActivate: [authGuard] },
  { path: 'admin/team', component: AdminTeamComponent, canActivate: [authGuard] },
  { path: 'admin/edit-project/:id', component: AdminEditProjectComponent, canActivate: [authGuard] },
  { path: 'admin/edit-news/:id', component: AdminEditNewsComponent, canActivate: [authGuard] },
  { path: 'admin/edit-publication/:id', component: AdminEditPublicationComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];