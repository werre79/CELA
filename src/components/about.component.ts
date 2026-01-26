import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div class="max-w-7xl mx-auto px-4 relative z-10">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 class="text-4xl font-bold text-brand-cream mb-6">{{ ts.t().about.title }}</h2>
            <p class="text-lg text-brand-stone leading-relaxed">
              {{ ts.t().about.description }}
            </p>
          </div>
          <div class="hidden lg:block h-48 rounded-squircle bg-brand-charcoal border border-white/5 relative overflow-hidden">
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-glow/10 rounded-full blur-3xl"></div>
             <div class="absolute inset-0 flex items-center justify-center opacity-10">
                <div class="w-20 h-20 bg-brand-amber rounded-xl flex items-center justify-center text-white font-bold text-4xl">Ц</div>
             </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          
          <div class="md:col-span-2 group relative p-8 rounded-squircle bg-brand-charcoal border border-white/5 hover:border-brand-amber/30 transition-all duration-500 overflow-hidden">
            <div class="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-brand-amber group-hover:scale-110 transition-transform">
               <span class="material-icons-round text-3xl">lightbulb</span>
            </div>
            <div class="relative z-10 h-full flex flex-col justify-end">
              <h3 class="text-2xl font-bold text-brand-cream mb-2">{{ ts.t().about.cards.innovation.title }}</h3>
              <p class="text-brand-stone group-hover:text-white transition-colors">{{ ts.t().about.cards.innovation.desc }}</p>
            </div>
          </div>

          <div class="group relative p-8 rounded-squircle bg-brand-charcoal border border-white/5 hover:border-brand-amber/30 transition-all duration-500 overflow-hidden">
            <div class="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-brand-stone group-hover:scale-110 transition-transform">
               <span class="material-icons-round text-3xl">balance</span>
            </div>
            <div class="relative z-10 h-full flex flex-col justify-end">
              <h3 class="text-2xl font-bold text-brand-cream mb-2">{{ ts.t().about.cards.justice.title }}</h3>
              <p class="text-brand-stone group-hover:text-white transition-colors">{{ ts.t().about.cards.justice.desc }}</p>
            </div>
          </div>

          <div class="group relative p-8 rounded-squircle bg-brand-charcoal border border-white/5 hover:border-brand-amber/30 transition-all duration-500 overflow-hidden">
            <div class="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-brand-glow group-hover:scale-110 transition-transform">
               <span class="material-icons-round text-3xl">diversity_3</span>
            </div>
            <div class="relative z-10 h-full flex flex-col justify-end">
              <h3 class="text-2xl font-bold text-brand-cream mb-2">{{ ts.t().about.cards.community.title }}</h3>
              <p class="text-brand-stone group-hover:text-white transition-colors">{{ ts.t().about.cards.community.desc }}</p>
            </div>
          </div>
          
           <div class="md:col-span-2 relative p-8 rounded-squircle flex items-center justify-center text-center pointer-events-none">
              <p class="text-brand-stone/60 font-bold text-lg tracking-[0.2em] uppercase">{{ ts.t().about.cards.tagline }}</p>
           </div>

        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  ts = inject(TranslationService);
}