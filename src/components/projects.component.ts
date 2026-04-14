import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="projects" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
           <div>
             <span class="text-stone-400 font-bold tracking-widest uppercase text-xs block mb-4 border-l-2 border-white/20 pl-3">{{ ts.t().projects.label }}</span>
             <h2 class="font-serif font-bold text-4xl md:text-5xl text-white">{{ ts.t().projects.title }}</h2>
           </div>
        </div>
        
        @if (isLoading()) {
          <div class="flex justify-center items-center py-20">
            <span class="material-icons-round animate-spin text-4xl text-white/50">refresh</span>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (project of projects(); track project.$id) {
            <div class="group flex flex-col h-full rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-lg transition-all duration-300 bg-white/5 border border-white/10">
              <!-- Image -->
              <div class="h-64 overflow-hidden relative border-b border-white/10">
                @if (project.image) {
                   <img [src]="project.image" class="w-full h-full object-cover">
                } @else {
                   <div class="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                      <span class="material-icons-round text-4xl">image</span>
                   </div>
                }
                
                <div class="absolute top-4 left-4">
                  <span class="inline-block px-3 py-1 bg-stone-900 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                    {{ project.type === 'donor' ? ts.t().projects.donors : ts.t().projects.probono }}
                  </span>
                </div>
              </div>

              <div class="p-8 flex flex-col flex-grow">
                <h3 class="font-serif font-bold text-2xl text-white mb-3 hover:text-stone-300 transition-colors">
                  {{ project.title }}
                </h3>
                <p class="font-sans text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {{ project.desc }}
                </p>

                <div class="mt-auto">
                   <a [routerLink]="['/project', project.slug || project.$id]" 
                      class="inline-flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider group/link hover:text-stone-300 transition-colors">
                      {{ ts.t().projects.readCaseStudy }}
                      <span class="material-icons-round text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                   </a>
                </div>
              </div>
            </div>
          }
        </div>
        
        @if (!projects().length && !isLoading()) {
          <div class="text-center py-20 px-6 rounded-2xl border border-dashed border-white/20 bg-white/5 max-w-2xl mx-auto flex flex-col items-center mt-12">
            <svg class="w-24 h-24 text-white/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 class="text-xl font-serif text-white/80 mb-2">{{ ts.t().projects.title }}</h3>
            <p class="font-sans text-stone-400">{{ ts.t().projects.empty }}</p>
          </div>
        }
      </div>
    </section>
  `
})
export class ProjectsComponent implements OnInit {
  ts = inject(TranslationService);
  data = inject(DataService);

  isLoading = signal(true);
  projects = signal<any[]>([]);

  async ngOnInit() {
    try {
      const data = await this.data.getProjects();
      this.projects.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }
}