import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TranslationService } from '../services/translation.service';

interface ServiceDisplay {
  title: string;
  desc: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <section id="services" class="py-20 bg-slate-50 relative overflow-hidden">
      <!-- Decorative circle -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-bl-full opacity-50 -z-0"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ ts.t().services.title }}</h2>
            <div class="w-20 h-1 bg-amber-500 mt-4 rounded-full"></div>
          </div>
          <div class="mt-4 md:mt-0">
             <span class="text-amber-700 font-medium">{{ ts.t().services.subtitle }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (service of servicesDisplay(); track service.title) {
            <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all cursor-default">
              <div [class]="'w-12 h-12 rounded-lg flex items-center justify-center mb-4 ' + service.colorClass">
                <span class="material-icons-round text-white">{{ service.icon }}</span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">{{ service.title }}</h3>
              <p class="text-sm text-slate-600">{{ service.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  ts = inject(TranslationService);

  // Metadata for styling the services, indices match the translation array
  private serviceMetadata = [
    { icon: 'analytics', colorClass: 'bg-amber-600' },
    { icon: 'gavel', colorClass: 'bg-orange-600' },
    { icon: 'visibility', colorClass: 'bg-yellow-600' },
    { icon: 'school', colorClass: 'bg-amber-800' }
  ];

  servicesDisplay = computed<ServiceDisplay[]>(() => {
    const texts = this.ts.t().services.items;
    return texts.map((text, index) => ({
      title: text.title,
      desc: text.desc,
      icon: this.serviceMetadata[index].icon,
      colorClass: this.serviceMetadata[index].colorClass
    }));
  });
}