import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from './hero.component';
import { AboutComponent } from './about.component';
import { ServicesComponent } from './services.component';
import { TeamComponent } from './team.component';
import { ContactComponent } from './contact.component';
import { ProjectsComponent } from './projects.component';
import { PublicationsComponent } from './publications.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ProjectsComponent,
    TeamComponent,
    PublicationsComponent,
    ContactComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-about></app-about>
    <app-services></app-services>
    <app-projects></app-projects>
    <app-team></app-team>
    <app-publications></app-publications>
    <app-contact></app-contact>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}