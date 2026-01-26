import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" 
         [ngClass]="{
           'bg-brand-dark/80 backdrop-blur-xl border-b border-white/5 py-3': isScrolled(),
           'py-6 bg-transparent': !isScrolled()
         }">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          
          <div class="flex items-center gap-3 cursor-pointer group" (click)="scrollTo('home')">
            <div class="w-10 h-10 bg-brand-amber rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-105">Ц</div>
            <span class="font-bold text-xl tracking-wide text-brand-cream">ЦЕПА</span>
          </div>

          <div class="hidden md:flex items-center gap-6">
            <button (click)="scrollTo('about')" [class]="getLinkClass()">{{ ts.t().nav.about }}</button>
            <button (click)="scrollTo('services')" [class]="getLinkClass()">{{ ts.t().nav.services }}</button>
            <button (click)="scrollTo('projects')" [class]="getLinkClass()">{{ ts.t().nav.projects }}</button>
            <button (click)="scrollTo('publications')" [class]="getLinkClass()">{{ ts.t().nav.publications }}</button>
            <button (click)="scrollTo('team')" [class]="getLinkClass()">{{ ts.t().nav.team }}</button>
            <button (click)="scrollTo('contact')" [class]="getLinkClass()">{{ ts.t().nav.contact }}</button>

            <div class="h-6 w-px bg-white/10 mx-2"></div>

            <div class="flex items-center gap-3">
              <button (click)="setLang('ua')" [class]="getLangClass('ua')">UA</button>
              <button (click)="setLang('en')" [class]="getLangClass('en')">EN</button>
            </div>

            <button (click)="openDonation()" 
                    class="ml-4 px-5 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-lg bg-brand-cream text-brand-dark hover:bg-white text-sm">
              {{ ts.t().nav.support }}
            </button>
          </div>

          <div class="md:hidden flex items-center">
            <button (click)="toggleMobileMenu()" class="text-2xl text-brand-cream focus:outline-none">
              <span class="material-icons-round">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>

      @if (isMobileMenuOpen) {
        <div class="md:hidden absolute top-full left-0 right-0 bg-brand-charcoal border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl">
          <button (click)="mobileScrollTo('about')" class="text-left py-3 px-4 rounded-lg hover:bg-white/5 text-brand-cream">{{ ts.t().nav.about }}</button>
          <button (click)="mobileScrollTo('services')" class="text-left py-3 px-4 rounded-lg hover:bg-white/5 text-brand-cream">{{ ts.t().nav.services }}</button>
          <button (click)="mobileScrollTo('projects')" class="text-left py-3 px-4 rounded-lg hover:bg-white/5 text-brand-cream">{{ ts.t().nav.projects }}</button>
          <button (click)="mobileScrollTo('publications')" class="text-left py-3 px-4 rounded-lg hover:bg-white/5 text-brand-cream">{{ ts.t().nav.publications }}</button>
          <button (click)="mobileScrollTo('team')" class="text-left py-3 px-4 rounded-lg hover:bg-white/5 text-brand-cream">{{ ts.t().nav.team }}</button>
          <button (click)="mobileScrollTo('contact')" class="text-left py-3 px-4 rounded-lg hover:bg-white/5 text-brand-cream">{{ ts.t().nav.contact }}</button>
          
          <div class="flex justify-center gap-6 py-4 border-t border-white/10 mt-2">
            <button (click)="setLang('ua')" [ngClass]="ts.currentLang() === 'ua' ? 'text-brand-amber font-bold' : 'text-brand-stone'">UA</button>
            <button (click)="setLang('en')" [ngClass]="ts.currentLang() === 'en' ? 'text-brand-amber font-bold' : 'text-brand-stone'">EN</button>
          </div>
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
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 20);
      });
    }
  }

  getLinkClass() {
    return "font-medium transition-colors text-brand-stone hover:text-brand-glow text-sm tracking-wide";
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
    return this.ts.currentLang() === lang ? "text-sm font-bold text-brand-cream" : "text-sm text-brand-stone hover:text-white transition-colors";
  }
  
  openDonation() {
    alert('Тут буде інтеграція LiqPay/WayForPay');
  }
}