import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { AppwriteService } from '../services/appwrite.service'; // 1. Імпорт сервісу
import { ProjectButtonComponent } from './project-button.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectButtonComponent],
  template: `
    <section id="projects" class="py-20 bg-brand-cream text-slate-800">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-10 text-brand-dark">{{ ts.t().projects.title }}</h2>
        
        @if (isLoading()) {
          <div class="text-center py-10 text-brand-orange animate-pulse">
            Завантаження проєктів...
          </div>
        }

        @if (!isLoading() && projects().length === 0) {
          <div class="text-center py-10 text-slate-400">
            <p>Наразі проєктів немає. Завітайте згодом.</p>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          @if (donorProjects().length > 0) {
            <div class="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-brand-orange">
               <h3 class="text-xl font-bold mb-4 text-brand-dark flex items-center gap-2">
                 <span class="material-icons-round text-brand-orange">public</span>
                 {{ ts.t().projects.donors }}
               </h3>
               
               <div *ngFor="let item of donorProjects()" class="mb-6 last:mb-0 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-orange/20 transition-colors flex flex-col items-start h-full">
                 <div *ngIf="item.image" class="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
                    <img [src]="item.image" alt="{{ item.title }}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                 </div>

                 <strong class="block text-xl mb-3 text-brand-dark">{{ item.title }}</strong>
                 <p class="text-slate-600 text-sm mb-6 flex-grow">{{ item.desc }}</p>
                 
                 <app-project-button [link]="['/project', item.$id]">
                   Детальніше
                 </app-project-button>
               </div>
            </div>
          }

          @if (probonoProjects().length > 0) {
            <div class="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-brand-yellow">
               <h3 class="text-xl font-bold mb-4 text-brand-dark flex items-center gap-2">
                 <span class="material-icons-round text-brand-yellow">volunteer_activism</span>
                 {{ ts.t().projects.probono }}
               </h3>
               
               <div *ngFor="let item of probonoProjects()" class="mb-6 last:mb-0 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-yellow/30 transition-colors flex flex-col items-start h-full">
                 
                 <div *ngIf="item.image" class="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
                    <img [src]="item.image" alt="{{ item.title }}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                 </div>

                 <strong class="block text-xl mb-3 text-brand-dark">{{ item.title }}</strong>
                 <p class="text-slate-600 text-sm mb-6 flex-grow">{{ item.desc }}</p>
                 
                 <app-project-button [link]="['/project', item.$id]">
                   Детальніше
                 </app-project-button>
               </div>
            </div>
          }

        </div>
      </div>
    </section>
  `
})
export class ProjectsComponent implements OnInit {
  ts = inject(TranslationService);
  appwrite = inject(AppwriteService); // Підключаємо наш сервіс

  isLoading = signal(true); // Стан завантаження
  projects = signal<any[]>([]); // Тут будуть жити дані з бази

  // Фільтруємо отримані дані на льоту
  donorProjects = computed(() => this.projects().filter(p => p.type === 'donor'));
  probonoProjects = computed(() => this.projects().filter(p => p.type === 'probono'));

  async ngOnInit() {
    // Як тільки компонент завантажився — робимо запит до бази
    try {
      const data = await this.appwrite.getProjects();
      this.projects.set(data);
    } finally {
      this.isLoading.set(false); 
    }
  }
}