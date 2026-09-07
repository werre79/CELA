import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService, Language } from '../services/translation.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 pointer-events-none">

      <nav class="pointer-events-auto w-full max-w-5xl glass-panel rounded-pill px-5 py-3
                  flex items-center justify-between gap-3
                  transition-all duration-500"
           [class.navbar-scrolled]="isScrolled"
           id="navbar-bar">

        <!-- LOGO -->
        <a routerLink="/"
           class="flex items-center gap-2 group flex-shrink-0">
          <span class="font-serif font-bold text-xl tracking-tight text-white
                       transition-colors duration-300">
            CELA
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-terra-500 opacity-80
                       group-hover:scale-125 transition-transform duration-300 flex-shrink-0"></span>
        </a>

        <!-- DESKTOP CENTER LINKS -->
        <div class="hidden md:flex items-center gap-1 flex-1 justify-center">
          <a routerLink="/" fragment="projects"
             class="px-4 py-2 rounded-full text-sm font-sans text-stone-300
                    hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer whitespace-nowrap">
            {{ ts.t().nav.projects }}
          </a>
          <a routerLink="/" fragment="publications"
             class="px-4 py-2 rounded-full text-sm font-sans text-stone-300
                    hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer whitespace-nowrap">
            {{ ts.t().nav.publications }}
          </a>
          <a routerLink="/" fragment="team"
             class="px-4 py-2 rounded-full text-sm font-sans text-stone-300
                    hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer whitespace-nowrap">
            {{ ts.t().nav.team }}
          </a>
        </div>

        <!-- DESKTOP RIGHT CONTROLS -->
        <div class="hidden md:flex items-center gap-3 flex-shrink-0">
          <div class="h-5 w-px bg-white/20"></div>

          <!-- CTA -->
          <a [href]="env.supportFormUrl"
             target="_blank" rel="noopener noreferrer"
             id="navbar-cta-support"
             class="btn-terra inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                    text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            <span>{{ ts.t().nav.support }}</span>
            <span class="material-icons-round" style="font-size:14px;">open_in_new</span>
          </a>
        </div>

        <!-- MOBILE HAMBURGER -->
        <button (click)="toggleMobileMenu()"
                class="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
          <span class="material-icons-round text-xl">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </nav>

      <!-- ── MOBILE DROPDOWN ── -->
      @if (isMobileMenuOpen) {
        <div class="pointer-events-auto md:hidden absolute top-[72px] left-4 right-4
                    rounded-squircle p-6 flex flex-col gap-4 border border-white/10"
             style="background: rgba(27, 29, 33, 0.96); backdrop-filter: blur(24px);">

          <a routerLink="/" (click)="closeMobileMenu()"
             class="text-base font-serif font-medium text-white hover:text-terra-300 transition-colors">
            Головна
          </a>
          <a routerLink="/" fragment="projects" (click)="closeMobileMenu()"
             class="text-base font-serif font-medium text-white hover:text-terra-300 transition-colors">
            {{ ts.t().nav.projects }}
          </a>
          <a routerLink="/" fragment="publications" (click)="closeMobileMenu()"
             class="text-base font-serif font-medium text-white hover:text-terra-300 transition-colors">
            {{ ts.t().nav.publications }}
          </a>
          <a routerLink="/" fragment="team" (click)="closeMobileMenu()"
             class="text-base font-serif font-medium text-white hover:text-terra-300 transition-colors">
            {{ ts.t().nav.team }}
          </a>

          <div class="h-px bg-white/10"></div>

          <div class="flex items-center justify-center">
            <a [href]="env.supportFormUrl"
               target="_blank" rel="noopener noreferrer"
               (click)="closeMobileMenu()"
               class="btn-terra inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                      text-xs font-bold uppercase tracking-wider w-full justify-center">
              {{ ts.t().nav.support }}
            </a>
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  ts = inject(TranslationService);
  readonly env = environment;
  isMobileMenuOpen = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 60;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}