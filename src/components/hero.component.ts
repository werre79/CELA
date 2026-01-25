import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="home" class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#2E1A12] to-black z-0"></div>
      
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-yellow/10 rounded-full blur-[80px]"></div>

      <div class="relative z-10 text-center px-4 max-w-5xl mx-auto">
        
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8 animate-fade-in-up">
          <span class="material-icons-round text-brand-yellow text-sm">verified</span>
          <span class="text-brand-yellow text-sm font-medium tracking-wide">{{ ts.t().hero.badge }}</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
          {{ ts.t().hero.titleStart }} <br class="hidden md:block"/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow">
             {{ ts.t().hero.titleEnd }}
          </span>
        </h1>

        <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          {{ ts.t().hero.description }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          
          <button (click)="scrollTo('contact')" 
                  class="px-8 py-4 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
             {{ ts.t().hero.btnContact }}
          </button>
          
          <button (click)="scrollTo('projects')" 
                  class="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto">
             {{ ts.t().hero.btnMore }}
          </button>

        </div>
      </div>

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
        <span class="material-icons-round">keyboard_arrow_down</span>
      </div>
    </section>
  `
})
export class HeroComponent {
  ts = inject(TranslationService);

  // Функція прокрутки (така сама, як у Navbar)
  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Секцію з id="${id}" не знайдено!`);
    }
  }
}