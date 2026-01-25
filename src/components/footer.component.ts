import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-brand-dark text-slate-400 py-12 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4 text-white">
              <div class="w-8 h-8 border-2 border-brand-orange rounded flex items-center justify-center font-bold bg-brand-orange text-white">Ц</div>
              <span class="font-bold text-xl">ЦЕПА</span>
            </div>
            <p class="text-sm text-slate-500 mb-6 max-w-xs">
              Ми — незалежний аналітичний центр, що фокусується на стійкій відбудові України, питаннях безпеки та впровадженні ESG стандартів.
            </p>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Навігація</h4>
            <ul class="space-y-2 text-sm">
              <li><button (click)="scrollTo('about')" class="hover:text-brand-orange transition-colors">Про нас</button></li>
              <li><button (click)="scrollTo('projects')" class="hover:text-brand-orange transition-colors">Проєкти</button></li>
              <li><button (click)="scrollTo('publications')" class="hover:text-brand-orange transition-colors">Публікації</button></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Співпраця</h4>
            <p class="text-sm mb-4">Потрібна експертна допомога?</p>
            
            <button (click)="scrollTo('contact')" 
                    class="px-6 py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-[#c5662a] transition-colors w-full md:w-auto text-sm flex items-center justify-center gap-2">
              {{ ts.t().contact.formTitle }} 
              <span class="material-icons-round text-sm">north_east</span>
            </button>
          </div>
        </div>

        <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>{{ ts.t().footer.rights }}</p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-brand-orange transition-colors">{{ ts.t().footer.privacy }}</a>
            <a href="#" class="hover:text-brand-orange transition-colors">{{ ts.t().footer.terms }}</a>
          </div>
          <p class="mt-4 md:mt-0 text-slate-600">Designed for CELA UA</p>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  ts = inject(TranslationService);

  // Додаємо метод прокрутки, якого тут не вистачало
  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}