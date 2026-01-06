import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="home" class="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <!-- Background Shapes/Gradient -->
      <div class="absolute top-0 left-0 w-full h-full -z-10 bg-slate-50">
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div class="absolute top-[20%] left-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] right-[20%] w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-8 shadow-sm">
          <span class="material-icons-round text-base mr-2">analytics</span>
          {{ ts.t().hero.badge }}
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          {{ ts.t().hero.titleStart }} <br class="hidden md:block"/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
            {{ ts.t().hero.titleEnd }}
          </span>
        </h1>
        
        <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
          {{ ts.t().hero.description }}
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button (click)="scrollTo('contact')" class="px-8 py-3 bg-amber-600 text-white font-medium rounded-full shadow-lg hover:bg-amber-700 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center">
            {{ ts.t().hero.btnContact }}
            <span class="material-icons-round ml-2">arrow_forward</span>
          </button>
          
          <button (click)="openSupport()" class="px-8 py-3 bg-amber-100 text-amber-800 font-medium rounded-full shadow-md hover:bg-amber-200 transition-colors flex items-center justify-center">
             <span class="material-icons-round mr-2">favorite</span>
             {{ ts.t().hero.btnSupport }}
          </button>

          <button (click)="scrollTo('about')" class="px-8 py-3 bg-white text-slate-700 font-medium rounded-full shadow-md border border-slate-200 hover:bg-slate-50 hover:text-amber-600 transition-colors flex items-center justify-center">
            {{ ts.t().hero.btnMore }}
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  ts = inject(TranslationService);

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  openSupport() {
    alert(this.ts.t().nav.support + ': Посилання на донат (LiqPay/WayForPay)');
  }
}