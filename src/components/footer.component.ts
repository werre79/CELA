import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <span class="font-bold text-white text-lg">ЦЕПА</span>
          <span class="mx-2">|</span>
          <span class="text-sm">{{ ts.t().footer.rights }}</span>
        </div>
        <div class="flex space-x-6 text-sm">
          <a href="#" class="hover:text-amber-500 transition-colors">{{ ts.t().footer.privacy }}</a>
          <a href="#" class="hover:text-amber-500 transition-colors">{{ ts.t().footer.terms }}</a>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  ts = inject(TranslationService);
}