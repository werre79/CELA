import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-[#12100E] text-brand-stone py-16 border-t border-white/5 relative overflow-hidden">
      
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-amber/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-3 mb-6 text-brand-cream">
              <div class="w-8 h-8 rounded-lg bg-brand-amber flex items-center justify-center font-bold text-white shadow-lg">Ц</div>
              <span class="font-bold text-xl tracking-wide">ЦЕПА</span>
            </div>
            <p class="text-sm leading-relaxed max-w-sm text-brand-stone/80">
              Незалежний аналітичний центр, що фокусується на стійкій відбудові України, питаннях безпеки та впровадженні ESG стандартів. Ми створюємо візію майбутнього.
            </p>
          </div>

          <div>
            <h4 class="text-brand-cream font-bold mb-6 uppercase text-xs tracking-widest">Навігація</h4>
            <ul class="space-y-3 text-sm">
              <li><button (click)="scrollTo('about')" class="hover:text-brand-glow transition-colors">Про нас</button></li>
              <li><button (click)="scrollTo('projects')" class="hover:text-brand-glow transition-colors">Проєкти</button></li>
              <li><button (click)="scrollTo('publications')" class="hover:text-brand-glow transition-colors">Публікації</button></li>
              <li><button (click)="scrollTo('team')" class="hover:text-brand-glow transition-colors">Команда</button></li>
            </ul>
          </div>

          <div>
            <h4 class="text-brand-cream font-bold mb-6 uppercase text-xs tracking-widest">Дія</h4>
            <button (click)="scrollTo('contact')" 
                    class="w-full px-6 py-4 bg-brand-charcoal border border-white/10 text-brand-cream font-bold rounded-lg hover:bg-brand-amber hover:border-brand-amber transition-all duration-300 shadow-lg text-sm flex items-center justify-center gap-2 group">
              {{ ts.t().contact.formTitle }} 
              <span class="material-icons-round text-sm group-hover:translate-x-1 transition-transform">north_east</span>
            </button>
            <p class="mt-4 text-xs text-brand-stone/60 text-center">Відповідаємо протягом 24 годин</p>
          </div>
        </div>

        <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-stone/60">
          <p>{{ ts.t().footer.rights }}</p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-brand-glow transition-colors">{{ ts.t().footer.privacy }}</a>
            <a href="#" class="hover:text-brand-glow transition-colors">{{ ts.t().footer.terms }}</a>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  ts = inject(TranslationService);

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}