import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { CommonModule } from '@angular/common';

interface ServiceDisplay {
  title: string;
  desc: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" class="py-20 bg-slate-50 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ ts.t().services.title }}</h2>
          <div class="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p class="mt-4 text-amber-700 font-medium">{{ ts.t().services.subtitle }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div *ngFor="let service of servicesDisplay()" class="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all flex flex-col h-full">
            <div class="flex items-center mb-6">
              <div [class]="'w-14 h-14 rounded-xl flex items-center justify-center mr-5 shadow-sm ' + service.colorClass">
                <span class="material-icons-round text-white text-3xl">{{ service.icon }}</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 leading-tight">{{ service.title }}</h3>
            </div>
            <p class="text-slate-600 mb-8 flex-grow leading-relaxed">{{ service.desc }}</p>
            <div class="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
              <span class="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wide rounded-full">Аналіз</span>
              <span class="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wide rounded-full">Коментування</span>
              <span class="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wide rounded-full">Розробка</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  ts = inject(TranslationService);

  private serviceMetadata = [
    { icon: 'construction', colorClass: 'bg-amber-600' },
    { icon: 'security', colorClass: 'bg-blue-600' },
    { icon: 'eco', colorClass: 'bg-green-600' },
    { icon: 'gavel', colorClass: 'bg-orange-700' }
  ];

  servicesDisplay = computed<ServiceDisplay[]>(() => {
    const texts = this.ts.t().services.items;
    // Додаємо типи text:any та index:number
    return texts.map((text: any, index: number) => ({
      title: text.title,
      desc: text.desc,
      icon: this.serviceMetadata[index]?.icon || 'info',
      colorClass: this.serviceMetadata[index]?.colorClass || 'bg-slate-500'
    }));
  });
}