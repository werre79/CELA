import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { AppwriteService } from '../services/appwrite.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="projects" class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-brand-cream mb-4 tracking-tight">
            {{ ts.t().projects.title }}
          </h2>
          <div class="h-1 w-24 bg-brand-amber mx-auto rounded-full"></div>
        </div>
        
        @if (isLoading()) {
          <div class="flex justify-center items-center py-20">
            <span class="material-icons-round animate-spin text-4xl text-brand-glow">refresh</span>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          
          @for (project of projects(); track project.$id; let i = $index) {
            <div 
              #projectCard
              class="group relative rounded-squircle bg-brand-charcoal border border-white/5 overflow-hidden hover:border-brand-amber/30 transition-colors duration-500"
              [class.md:col-span-2]="i === 0 || i === 3" 
              [class.md:row-span-2]="i === 2"
              (mousemove)="handleMouseMove($event, projectCard)"
            >
              <div 
                class="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                [style.background]="getGradientStyle(projectCard)"
              ></div>

              <div class="relative h-full flex flex-col p-8 z-10">
                
                @if (project.image) {
                  <div class="absolute inset-0 z-0">
                    <img [src]="project.image" class="w-full h-full object-cover opacity-20 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0">
                    <div class="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/80 to-transparent transition-opacity duration-500 group-hover:opacity-60"></div>
                  </div>
                }

                <div class="relative z-10 mb-auto">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-white/10 backdrop-blur-md"
                    [ngClass]="project.type === 'donor' 
                      ? 'text-brand-glow bg-brand-glow/10' 
                      : 'text-brand-stone bg-white/5'">
                    {{ project.type === 'donor' ? ts.t().projects.donors : ts.t().projects.probono }}
                  </span>
                </div>

                <div class="relative z-10 mt-8">
                  <h3 class="text-2xl font-bold text-brand-cream mb-3 group-hover:text-brand-glow transition-colors">
                    {{ project.title }}
                  </h3>
                  <p class="text-brand-stone line-clamp-3 mb-6 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                    {{ project.desc }}
                  </p>

                  <a [routerLink]="['/project', project.$id]" 
                     class="inline-flex items-center gap-2 text-brand-cream font-bold group/btn">
                     Детальніше
                     <span class="material-icons-round text-brand-amber group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
        
        @if (!isLoading() && projects().length === 0) {
          <div class="text-center py-20 border border-dashed border-brand-stone/20 rounded-squircle">
            <p class="text-brand-stone">Проєкти скоро з'являться.</p>
          </div>
        }

      </div>
    </section>
  `
})
export class ProjectsComponent implements OnInit {
  ts = inject(TranslationService);
  appwrite = inject(AppwriteService);
  
  isLoading = signal(true);
  projects = signal<any[]>([]);

  async ngOnInit() {
    try {
      const data = await this.appwrite.getProjects();
      this.projects.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleMouseMove(e: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  getGradientStyle(card: HTMLElement) {
    return `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(245, 158, 11, 0.15), transparent 40%)`;
  }
}