import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section id="about" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ ts.t().about.title }}</h2>
          <div class="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p class="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            {{ ts.t().about.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Card 1 -->
          <div class="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300">
            <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="material-icons-round text-3xl">lightbulb</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ ts.t().about.cards.innovation.title }}</h3>
            <p class="text-slate-600 leading-relaxed">
              {{ ts.t().about.cards.innovation.desc }}
            </p>
          </div>

          <!-- Card 2 -->
          <div class="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300">
            <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="material-icons-round text-3xl">balance</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ ts.t().about.cards.justice.title }}</h3>
            <p class="text-slate-600 leading-relaxed">
              {{ ts.t().about.cards.justice.desc }}
            </p>
          </div>

          <!-- Card 3 -->
          <div class="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300">
            <div class="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-700 mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="material-icons-round text-3xl">groups</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ ts.t().about.cards.community.title }}</h3>
            <p class="text-slate-600 leading-relaxed">
              {{ ts.t().about.cards.community.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  ts = inject(TranslationService);
}