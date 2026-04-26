import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="relative pt-16 pb-8 border-t border-white/[0.08]"
            style="background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%);">

      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <!-- MAIN ROW -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">

          <!-- Branding + tagline -->
          <div class="max-w-sm">
            <a routerLink="/"
               class="inline-block font-serif font-bold text-3xl tracking-tight text-white mb-4
                      hover:text-terra-400 transition-colors duration-300">
              CELA
            </a>
            <p class="font-sans text-sm font-light text-stone-500 leading-relaxed">
              {{ tagline }}
            </p>
          </div>

          <!-- Contact info -->
          <div class="flex flex-col gap-3">
            <p class="text-xs text-stone-600 uppercase tracking-[0.15em] font-medium mb-1">
              {{ ts.t().nav.contact }}
            </p>
            <p class="text-stone-400 text-sm">{{ ts.t().footer.city }}</p>
            <a href="mailto:info&#64;cela.org.ua"
               class="text-stone-300 text-sm font-medium hover:text-terra-400 transition-colors duration-300">
              cepa.org&#64;gmail.com
            </a>
          </div>
        </div>

        <!-- BOTTOM BAR -->
        <div class="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p class="text-xs text-stone-600 font-sans">
            {{ ts.t().footer.rights }}
          </p>

          <!-- Staff login — discrete lock icon -->
          <a routerLink="/login"
             id="footer-staff-login"
             class="inline-flex items-center gap-2 text-xs text-stone-600
                    hover:text-stone-300 transition-colors duration-300 group">
            <span class="material-icons-round text-sm opacity-50 group-hover:opacity-100 transition-opacity">
              lock
            </span>
            {{ ts.t().footer.staffLogin }}
          </a>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  ts = inject(TranslationService);

  get tagline(): string {
    if (this.ts.currentLang() === 'ua') {
      return 'Центр економіко-правової аналітики. Незалежна експертиза для стійкого майбутнього України.';
    }
    return "Center for Economic and Legal Analytics. Independent expertise for Ukraine's sustainable future.";
  }
}