import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppwriteService } from '../services/appwrite.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#FBF7F1] pt-32 pb-20 text-[#2D241E]">
      
      @if (isLoading()) {
        <div class="flex flex-col justify-center items-center h-64 gap-4">
          <div class="w-12 h-12 border-4 border-[#A05A2C] border-t-transparent rounded-full animate-spin"></div>
          <span class="text-[#6B5D52] font-medium tracking-widest text-sm uppercase">Завантаження...</span>
        </div>
      }

      @if (!isLoading() && project()) {
        <article class="max-w-4xl mx-auto px-4 sm:px-6">
          
          <a routerLink="/" fragment="projects" class="inline-flex items-center text-[#A05A2C] font-bold hover:underline mb-8 transition-colors">
            <span class="material-icons-round mr-2">arrow_back</span>
            Назад до проєктів
          </a>

          <div *ngIf="project().image" class="rounded-[24px] overflow-hidden shadow-lg mb-10 w-full aspect-video relative group">
            <img [src]="project().image" [alt]="project().title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-[#2D241E]/30 to-transparent"></div>
          </div>

          <div class="bg-white rounded-[24px] p-8 md:p-12 shadow-sm border border-[#A05A2C]/10">
            
            <div class="flex gap-2 mb-6">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FBF7F1] text-[#A05A2C] border border-[#A05A2C]/20">
                {{ project().type === 'donor' ? 'Донорський проєкт' : 'Pro Bono' }}
              </span>
            </div>

            <h1 class="text-3xl md:text-5xl font-bold mb-6 leading-tight font-serif text-[#2D241E]">
              {{ project().title }}
            </h1>

            <p class="text-xl text-[#6B5D52] mb-8 leading-relaxed">
              {{ project().desc }}
            </p>

            <div class="prose prose-lg prose-stone max-w-none text-[#2D241E] leading-loose">
               <p class="whitespace-pre-line">{{ project().details || project().desc }}</p>
            </div>

            <div class="mt-12 pt-8 border-t border-[#A05A2C]/10 flex flex-col sm:flex-row gap-4">
               <button class="px-8 py-4 bg-[#A05A2C] text-white font-bold rounded-xl shadow-lg hover:bg-[#8B4D25] hover:-translate-y-1 transition-all">
                 Підтримати проєкт
               </button>
            </div>

          </div>

        </article>
      }

      @if (!isLoading() && !project()) {
        <div class="text-center py-20 px-4">
          <h2 class="text-2xl font-bold text-[#2D241E] mb-4">Проєкт не знайдено</h2>
          <p class="text-[#6B5D52] mb-8">Можливо, він був видалений або переміщений.</p>
          <a routerLink="/" class="text-[#A05A2C] font-bold hover:underline">Повернутися на головну</a>
        </div>
      }
    </div>
  `
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private appwrite = inject(AppwriteService);

  project = signal<any>(null);
  isLoading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      try {
        const data = await this.appwrite.getProjectById(id);
        this.project.set(data);
        window.scrollTo(0, 0);
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