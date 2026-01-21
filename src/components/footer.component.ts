import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          <div>
            <div class="flex items-center gap-2 mb-4 text-white">
              <span class="material-icons-round text-amber-500">analytics</span>
              <span class="font-bold text-xl">ЦЕПА</span>
            </div>
            <p class="text-sm leading-relaxed max-w-xs mb-6">
              {{ ts.t().about.description }}
            </p>
            <span class="text-xs text-slate-500">{{ ts.t().footer.rights }}</span>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-wider">Ми в соцмережах</h4>
            <div class="flex gap-4">
              <a href="https://youtube.com" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all group">
                <span class="material-icons-round group-hover:scale-110 transition-transform">play_arrow</span>
              </a>
              <a href="https://facebook.com" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group">
                <span class="material-icons-round group-hover:scale-110 transition-transform">facebook</span>
              </a>
              <a href="https://linkedin.com" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all group">
                <span class="material-icons-round group-hover:scale-110 transition-transform">work</span>
              </a>
              <a href="https://instagram.com" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all group">
                <span class="material-icons-round group-hover:scale-110 transition-transform">photo_camera</span>
              </a>
            </div>
          </div>

          <div class="flex flex-col items-start">
             <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-wider">Співпраця</h4>
             <p class="text-sm mb-4">Потрібна експертна допомога?</p>
             <button class="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20 flex items-center">
               <span>{{ ts.t().nav.consultation }}</span>
               <span class="material-icons-round ml-2 text-sm">arrow_outward</span>
             </button>
          </div>
        </div>

        <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between text-xs text-slate-500">
          <div class="flex gap-6 mb-4 md:mb-0">
             <a href="#" class="hover:text-amber-500 transition-colors">{{ ts.t().footer.privacy }}</a>
             <a href="#" class="hover:text-amber-500 transition-colors">{{ ts.t().footer.terms }}</a>
          </div>
          <div>Designed for CELA UA</div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  ts = inject(TranslationService);
}