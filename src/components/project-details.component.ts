import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pt-32 pb-20 min-h-screen bg-brand-cream text-brand-text">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <a routerLink="/" class="inline-flex items-center text-brand-orange hover:text-brand-dark mb-8 font-bold transition-colors">
          <span class="material-icons-round mr-2">arrow_back</span>
          На головну
        </a>

        @if (project(); as p) {
          <h1 class="text-4xl md:text-5xl font-bold text-brand-dark mb-6">{{ p.title }}</h1>
          
          <span class="inline-block px-4 py-1 rounded-full text-sm font-bold mb-8"
                [class]="p.type === 'donor' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-yellow/20 text-brand-dark'">
            {{ p.type === 'donor' ? 'Донорський проєкт' : 'Pro Bono' }}
          </span>

          <div class="w-full h-64 md:h-96 bg-slate-200 rounded-squircle mb-10 overflow-hidden relative">
             <div class="absolute inset-0 flex items-center justify-center text-slate-400">
               Фотозвіт проєкту {{ p.title }}
             </div>
             </div>

          <div class="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            <p>{{ p.details }}</p>
            <p>Тут буде розширений опис, документи PDF, таблиці та інше...</p>
          </div>

        } @else {
          <div class="text-center py-20">
            <h2 class="text-2xl font-bold text-slate-400">Проєкт не знайдено</h2>
          </div>
        }
      </div>
    </div>
  `
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  ts = inject(TranslationService);
  project = signal<any>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Знаходимо проєкт за ID з нашого сервісу
        const found = this.ts.getProjectById(id);
        this.project.set(found);
      }
    });
  }
}