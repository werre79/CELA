import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" 
         [class.bg-white/90]="isScrolled()" 
         [class.backdrop-blur-md]="isScrolled()"
         [class.shadow-sm]="isScrolled()"
         [class.py-2]="isScrolled()"
         [class.py-4]="!isScrolled()">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          
          <div class="flex items-center gap-2 cursor-pointer" (click)="scrollTo('home')">
            <div class="w-10 h-10 bg-[#D97736] rounded-lg flex items-center justify-center text-white font-bold text-xl">Ц</div>
            <span class="font-bold text-xl text-slate-800" [class.text-white]="!isScrolled() && !isMobileMenuOpen">ЦЕПА</span>
          </div>

          <div class="hidden md:flex items-center gap-8">
            <button (click)="scrollTo('about')" 
                    class="font-medium transition-colors hover:text-[#D97736]"
                    [class.text-slate-600]="isScrolled()"
                    [class.text-slate-200]="!isScrolled()">
              {{ ts.t().nav.about }}
            </button>
            <button (click)="scrollTo('services')" 
                    class="font-medium transition-colors hover:text-[#D97736]"
                    [class.text-slate-600]="isScrolled()"
                    [class.text-slate-200]="!isScrolled()">
              {{ ts.t().nav.services }}
            </button>
            <button (click)="scrollTo('projects')" 
                    class="font-medium transition-colors hover:text-[#D97736]"
                    [class.text-slate-600]="isScrolled()"
                    [class.text-slate-200]="!isScrolled()">
              {{ ts.t().nav.projects }}
            </button>
            <button (click)="scrollTo('publications')" 
                    class="font-medium transition-colors hover:text-[#D97736]"
                    [class.text-slate-600]="isScrolled()"
                    [class.text-slate-200]="!isScrolled()">
              {{ ts.t().nav.publications }}
            </button>
            <button (click)="scrollTo('team')" 
                    class="font-medium transition-colors hover:text-[#D97736]"
                    [class.text-slate-600]="isScrolled()"
                    [class.text-slate-200]="!isScrolled()">
              {{ ts.t().nav.team }}
            </button>
            <button (click)="scrollTo('contact')" 
                    class="font-medium transition-colors hover:text-[#D97736]"
                    [class.text-slate-600]="isScrolled()"
                    [class.text-slate-200]="!isScrolled()">
              {{ ts.t().nav.contact }}
            </button>

            <div class="flex items-center gap-2 border-l border-slate-500/30 pl-4 ml-2">
              <button (click)="setLang('ua')" [class]="getLangClass('ua')">UA</button>
              <button (click)="setLang('en')" [class]="getLangClass('en')">EN</button>
            </div>

            <button (click)="openDonation()" 
                    class="px-5 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                    [class.bg-[#D97736]="isScrolled()"
                    [class.text-white]="isScrolled()"
                    [class.bg-white]="!isScrolled()"
                    [class.text-[#2E1A12]]="!isScrolled()">
              {{ ts.t().nav.support }}
            </button>
          </div>

          <div class="md:hidden flex items-center">
            <button (click)="toggleMobileMenu()" class="text-2xl focus:outline-none" 
                    [class.text-slate-800]="isScrolled() || isMobileMenuOpen"
                    [class.text-white]="!isScrolled() && !isMobileMenuOpen">
              <span class="material-icons-round">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>

      @if (isMobileMenuOpen) {
        <div class="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 p-4 flex flex-col gap-4 animate-fade-in-down">
          <button (click)="mobileScrollTo('about')" class="text-left py-2 px-4 rounded-lg hover:bg-slate-50 font-medium text-slate-700">{{ ts.t().nav.about }}</button>
          <button (click)="mobileScrollTo('services')" class="text-left py-2 px-4 rounded-lg hover:bg-slate-50 font-medium text-slate-700">{{ ts.t().nav.services }}</button>
          <button (click)="mobileScrollTo('projects')" class="text-left py-2 px-4 rounded-lg hover:bg-slate-50 font-medium text-slate-700">{{ ts.t().nav.projects }}</button>
          <button (click)="mobileScrollTo('publications')" class="text-left py-2 px-4 rounded-lg hover:bg-slate-50 font-medium text-slate-700">{{ ts.t().nav.publications }}</button>
          <button (click)="mobileScrollTo('team')" class="text-left py-2 px-4 rounded-lg hover:bg-slate-50 font-medium text-slate-700">{{ ts.t().nav.team }}</button>
          <button (click)="mobileScrollTo('contact')" class="text-left py-2 px-4 rounded-lg hover:bg-slate-50 font-medium text-slate-700">{{ ts.t().nav.contact }}</button>
          
          <div class="border-t border-slate-100 my-2"></div>
          
          <div class="flex justify-center gap-6 py-2">
            <button (click)="setLang('ua')" class="font-bold text-lg" [class.text-[#D97736]]="ts.currentLang() === 'ua'" [class.text-slate-400]="ts.currentLang() !== 'ua'">UA</button>
            <button (click)="setLang('en')" class="font-bold text-lg" [class.text-[#D97736]]="ts.currentLang() === 'en'" [class.text-slate-400]="ts.currentLang() !== 'en'">EN</button>
          </div>

          <button (click)="openDonation()" class="w-full py-3 bg-[#D97736] text-white rounded-xl font-bold shadow-lg shadow-[#D97736]/30">
            {{ ts.t().nav.support }}
          </button>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  ts = inject(TranslationService);
  
  isScrolled = signal(false);
  isMobileMenuOpen = false;

  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 20);
    });
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  mobileScrollTo(id: string) {
    this.isMobileMenuOpen = false;
    this.scrollTo(id);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  setLang(lang: Language) {
    this.ts.setLanguage(lang);
  }

  getLangClass(lang: Language) {
    const isActive = this.ts.currentLang() === lang;
    const baseClass = "text-sm font-bold transition-colors";
    
    if (this.isScrolled()) {
      return isActive ? `${baseClass} text-[#D97736]` : `${baseClass} text-slate-400 hover:text-slate-600`;
    } else {
      return isActive ? `${baseClass} text-white` : `${baseClass} text-white/60 hover:text-white`;
    }
  }
  
  openDonation() {
    alert('Тут буде інтеграція LiqPay/WayForPay');
  }
}