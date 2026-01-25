import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- Важливо
import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet, // <-- Це місце, де міняються сторінки
    FooterComponent
  ],
  template: `
    <div class="flex flex-col min-h-screen font-sans bg-[#2E1A12] text-white">
      <app-navbar></app-navbar>
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}