import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TranslationService, Language } from '../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" (click)="scrollTo('home')">
            <div class="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
              Ц
            </div>
            <span class="font-bold text-xl tracking-tight text-slate-800">
              ЦЕПА
            </span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-6">
            <button (click)="scrollTo('about')" class="text-slate-600 hover:text-amber-600 font-medium transition-colors">{{ ts.t().nav.about }}</button>
            <button (click)="scrollTo('services')" class="text-slate-600 hover:text-amber-600 font-medium transition-colors">{{ ts.t().nav.services }}</button>
            <button (click)="scrollTo('team')" class="text-slate-600 hover:text-amber-600 font-medium transition-colors">{{ ts.t().nav.team }}</button>
            <button (click)="scrollTo('contact')" class="text-slate-600 hover:text-amber-600 font-medium transition-colors">{{ ts.t().nav.contact }}</button>
            
            <!-- Support Button -->
            <button (click)="openSupport()" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              {{ ts.t().nav.support }}
            </button>

            <!-- Language Switcher Desktop -->
            <div class="flex items-center space-x-2 pl-4 border-l border-slate-200">
              <button (click)="setLang('uk')" [class]="getLangClass('uk')">Укр</button>
              <span class="text-slate-300">|</span>
              <button (click)="setLang('pl')" [class]="getLangClass('pl')">PL</button>
              <span class="text-slate-300">|</span>
              <button (click)="setLang('en')" [class]="getLangClass('en')">EN</button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center gap-4">
             <!-- Language Switcher Mobile (Compact) -->
             <button (click)="cycleLang()" class="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded text-sm">
               {{ getMobileLabel() }}
             </button>

            <button (click)="toggleMenu()" class="text-slate-600 hover:text-amber-600 p-2 focus:outline-none">
              <span class="material-icons-round">{{ isMenuOpen() ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (isMenuOpen()) {
        <div class="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button (click)="mobileScrollTo('about')" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50">{{ ts.t().nav.about }}</button>
            <button (click)="mobileScrollTo('services')" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50">{{ ts.t().nav.services }}</button>
            <button (click)="mobileScrollTo('team')" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50">{{ ts.t().nav.team }}</button>
            <button (click)="mobileScrollTo('contact')" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50">{{ ts.t().nav.contact }}</button>
            
            <!-- Support Button Mobile -->
            <button (click)="openSupport()" class="block w-full text-center px-3 py-3 mt-4 rounded-md text-base font-bold text-white bg-amber-600 shadow-md active:bg-amber-700">
              {{ ts.t().nav.support }}
            </button>
          </div>
        </div>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  ts = inject(TranslationService);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  mobileScrollTo(id: string) {
    this.scrollTo(id);
    this.isMenuOpen.set(false);
  }

  setLang(lang: Language) {
    this.ts.setLanguage(lang);
  }

  getLangClass(lang: Language): string {
    return this.ts.currentLang() === lang 
      ? 'font-bold text-amber-600' 
      : 'font-medium text-slate-500 hover:text-slate-700';
  }

  cycleLang() {
    const current = this.ts.currentLang();
    if (current === 'uk') this.setLang('pl');
    else if (current === 'pl') this.setLang('en');
    else this.setLang('uk');
  }

  getMobileLabel() {
    const lang = this.ts.currentLang();
    return lang === 'uk' ? 'Укр' : lang.toUpperCase();
  }

  openSupport() {
    alert(this.ts.t().nav.support + ': Тут буде посилання на платіжну систему (наприклад, WayForPay або LiqPay).');
  }
}