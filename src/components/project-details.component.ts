import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppwriteService } from '../services/appwrite.service'; // Підключаємо Appwrite
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20">
      
      @if (isLoading()) {
        <div class="flex justify-center items-center h-64">
          <span class="material-icons-round animate-spin text-4xl text-brand-orange">refresh</span>
        </div>
      }

      @if (!isLoading() && project()) {
        <article class="max-w-4xl mx-auto px-4 sm:px-6">
          
          <a routerLink="/" fragment="projects" class="inline-flex items-center text-slate-500 hover:text-brand-orange mb-8 transition-colors">
            <span class="material-icons-round mr-2">arrow_back</span>
            Назад до проєктів
          </a>

          <div *ngIf="project().image" class="rounded-3xl overflow-hidden shadow-xl mb-10 h-[400px] w-full">
            <img [src]="project().image" [alt]="project().title" class="w-full h-full object-cover">
          </div>

          <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            
            <div class="flex gap-2 mb-6">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                {{ project().type === 'donor' ? 'Донорський проєкт' : 'Pro Bono' }}
              </span>
            </div>

            <h1 class="text-3xl md:text-5xl font-bold text-brand-dark mb-6 leading-tight">
              {{ project().title }}
            </h1>

            <div class="prose prose-lg prose-slate max-w-none text-slate-600">
               <p class="whitespace-pre-line">{{ project().details || project().desc }}</p>
            </div>

          </div>

        </article>
      }

      @if (!isLoading() && !project()) {
        <div class="text-center py-20">
          <h2 class="text-2xl font-bold text-slate-800">Проєкт не знайдено</h2>
          <a routerLink="/" class="text-brand-orange hover:underline mt-4 inline-block">Повернутися на головну</a>
        </div>
      }
    </div>
  `
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private appwrite = inject(AppwriteService); // Інжектуємо Appwrite
  
  // Видаляємо TranslationService, якщо він тут не використовується для перекладів тексту
  // ts = inject(TranslationService); 

  project = signal<any>(null);
  isLoading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      try {
        // Беремо дані з Appwrite, а не з TranslationService
        const data = await this.appwrite.getProjectById(id);
        this.project.set(data);
      } catch (error) {
        console.error('Project not found', error);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.isLoading.set(false);
    }
  }
}