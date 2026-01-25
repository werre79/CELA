import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProjectDetailsComponent } from './components/project-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Головна сторінка
  { path: 'project/:id', component: ProjectDetailsComponent }, // Сторінка проєкту (динамічна)
  { path: '**', redirectTo: '' } // Якщо сторінка не знайдена -> на головну
];