import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProjectDetailsComponent } from './components/project-details.component';
import { AdminProjectComponent } from './components/admin-project.component';
import { LoginComponent } from './components/login.component';
import { AdminTeamComponent } from './components/admin-team.component';
import { PublicationsComponent } from './components/publications.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'project/:id', component: ProjectDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/add', component: AdminProjectComponent, canActivate: [authGuard] },
  { path: 'admin/team', component: AdminTeamComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];