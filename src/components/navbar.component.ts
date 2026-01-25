import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TranslationService, Language } from '../services/translation.service';
import { CommonModule } from '@angular/common';
// 1. Імпорт
import { NeuButtonComponent } from './neu-button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // 2. Додаємо в imports
  imports: [CommonModule, NeuButtonComponent], 
  template: `
    <nav [class]="'fixed top-0 left-0 w-full z-50 transition-all duration-300 ' + (scrolled() ? 'bg-brand-dark/95 shadow-lg py-2' : 'bg-transparent py-4')">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer group" (click)="scrollTo('home')">
            <div class="w-10 h-10 border-2 border-brand rounded-lg flex items-center justify-center text-brand font-bold text-xl transition-all duration-500 ease-in-out group-hover:bg-brand group-hover:text-white">
              Ц
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-lg leading-none text-white tracking-wide transition-colors duration-300 group-hover:text-brand-foreground">CELA</span>
              <span class="text-[10px] text-slate-400 uppercase tracking-widest">Analytics Center</span>
            </div>
          </div>

          <div class="hidden md:flex items-center space-x-8">
             <button (click)="scrollTo('about')" class="text-sm font-medium text-slate-300 hover:text-brand-foreground transition-colors uppercase">
               {{ ts.t().nav.about }}
             </button>
             <button (click)="scrollTo('services')" class="text-sm font-medium text-slate-300 hover:text-brand-foreground transition-colors uppercase">
               {{ ts.t().nav.services }}
             </button>
             </div>

          <div class="hidden md:flex items-center gap-6">
            <div class="flex items-center text-xs font-bold text-slate-500">
               <button (click)="setLang('uk')" [class]="getLangClass('uk')">UA</button>
               <span class="mx-2">|</span>
               <button (click)="setLang('en')" [class]="getLangClass('en')">EN</button>
            </div>
            
            <app-neu-button (click)="openSupport()">
              {{ ts.t().nav.support }}
            </app-neu-button>
          </div>

          </div>
      </div>
      </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  // ... код класу без змін ...
  ts = inject(TranslationService);
  isMenuOpen = signal(false);
  scrolled = signal(false);

  constructor() {
    window.addEventListener('scroll', () => {
      this.scrolled.set(window.scrollY > 50);
    });
  }
  
  toggleMenu() { this.isMenuOpen.update(v => !v); }
  scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
  setLang(lang: Language) { this.ts.setLanguage(lang); }
  getLangClass(lang: Language): string { return this.ts.currentLang() === lang ? 'text-white' : 'hover:text-white transition-colors'; }
  openSupport() { alert('LiqPay Link'); }
}