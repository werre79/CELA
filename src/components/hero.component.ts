import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark text-brand-cream">
      
      <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-amber/20 rounded-full blur-[120px] animate-blob mix-blend-screen opacity-60"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-glow/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen opacity-60"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

      <div class="relative z-10 text-center px-4 max-w-5xl mx-auto">
        
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12 animate-fade-in-up">
          <span class="material-icons-round text-brand-glow text-sm">verified</span>
          <span class="text-brand-stone text-sm font-medium tracking-wide">{{ ts.t().hero.badge }}</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up delay-100">
          {{ ts.t().hero.titleStart }} <br class="hidden md:block"/>
          
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#F59E0B] to-[#B45309] drop-shadow-lg">
             {{ ts.t().hero.titleEnd }}
          </span>
        </h1>

        <p class="text-xl text-brand-stone mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          {{ ts.t().hero.description }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
          <button (click)="scrollTo('contact')" 
                  class="group relative px-8 py-4 bg-brand-amber text-white font-bold rounded-squircle overflow-hidden shadow-lg shadow-brand-amber/20 hover:scale-105 transition-transform">
             <span class="relative z-10 flex items-center gap-2">
               {{ ts.t().hero.btnContact }}
               <span class="material-icons-round">arrow_forward</span>
             </span>
             <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          </button>
          
          <button (click)="scrollTo('projects')" 
                  class="px-8 py-4 bg-white/5 text-brand-cream font-bold rounded-squircle border border-white/10 hover:bg-white/10 hover:border-brand-amber/50 transition-all backdrop-blur-sm">
             {{ ts.t().hero.btnMore }}
          </button>
        </div>
      </div>

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-brand-stone/50">
        <span class="material-icons-round text-3xl">keyboard_arrow_down</span>
      </div>
    </section>
  `
})
export class HeroComponent {
  ts = inject(TranslationService);

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}