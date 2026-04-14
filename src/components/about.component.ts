import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="py-32 relative">
      <div class="max-w-4xl mx-auto text-center mb-20 relative z-10 px-6">
        <h2 class="font-serif font-normal text-3xl md:text-5xl text-white leading-tight mb-8">
          "{{ ts.t().about.cards.quote }} <span class="font-bold text-stone-300">{{ ts.t().about.cards.quoteThinks }}</span> {{ ts.currentLang() === 'ua' ? 'та' : 'and' }} <span class="font-bold text-stone-300">{{ ts.t().about.cards.quoteFeels }}</span>."
        </h2>
        <p class="font-sans text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          {{ ts.t().about.description }}
        </p>
      </div>

      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 relative z-10">
        <!-- Expertise Card -->
        <div class="rounded-2xl p-10 bg-white/[0.04] border border-white/10">
           <div class="w-16 h-16 bg-stone-800 text-stone-300 rounded-xl flex items-center justify-center mb-8 text-3xl transition-colors border border-white/5">
             <span class="material-icons-round">gavel</span>
           </div>
           <h3 class="font-serif font-bold text-3xl mb-4 text-white">{{ ts.t().about.cards.donorTitle }}</h3>
           <p class="text-stone-400 font-sans leading-relaxed mb-8 text-lg">
             {{ ts.t().about.cards.donorDesc }}
           </p>
           <ul class="space-y-3 font-sans text-sm text-stone-400">
             @for (item of ts.t().about.cards.donorItems; track item) {
               <li class="flex items-center gap-3">
                 <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                 {{ item }}
               </li>
             }
           </ul>
        </div>

        <!-- Community Card -->
        <div class="rounded-2xl p-10 bg-white/[0.04] border border-white/10">
           <div class="w-16 h-16 bg-stone-800 text-stone-300 rounded-xl flex items-center justify-center mb-8 text-3xl transition-colors border border-white/5">
             <span class="material-icons-round">diversity_3</span>
           </div>
           <h3 class="font-serif font-bold text-3xl mb-4 text-white">{{ ts.t().about.cards.probonoTitle }}</h3>
           <p class="text-stone-400 font-sans leading-relaxed mb-8 text-lg">
             {{ ts.t().about.cards.probonoDesc }}
           </p>
           <ul class="space-y-3 font-sans text-sm text-stone-400">
             @for (item of ts.t().about.cards.probonoItems; track item) {
               <li class="flex items-center gap-3">
                 <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                 {{ item }}
               </li>
             }
           </ul>
        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  ts = inject(TranslationService);
}