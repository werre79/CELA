import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="flex flex-col md:flex-row justify-center items-center mb-16 gap-8">
           <h2 class="font-serif font-bold text-4xl md:text-5xl text-white">{{ ts.t().services.title }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (item of ts.t().services.items; track item.title; let i = $index) {
            <div class="p-8 rounded-2xl bg-white/[0.04] border border-white/10">
               <span class="block text-4xl font-serif text-white/15 font-bold mb-6">0{{i+1}}</span>
               <h3 class="font-serif font-bold text-xl text-white mb-3">{{ item.title }}</h3>
               <p class="font-sans text-sm text-stone-400 leading-relaxed">{{ item.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  ts = inject(TranslationService);
}