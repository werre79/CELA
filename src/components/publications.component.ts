import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslationService } from '../services/translation.service';
import { DataService } from '../services/data.service';

@Component({
   selector: 'app-publications',
   standalone: true,
   imports: [CommonModule, DatePipe],
   template: `
    <section id="publications" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
           <div>
             <span class="text-primary-glow font-bold tracking-widest uppercase text-xs block mb-4 border-l-2 border-primary pl-3">{{ ts.t().publications.label }}</span>
             <h2 class="font-serif font-bold text-4xl md:text-5xl text-white drop-shadow-lg">{{ ts.t().publications.title }}</h2>
           </div>
           
           <!-- Glass Tabs -->
           <div class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
              <button (click)="setFilter('news')" 
                 class="px-6 py-2 rounded-full transition-all duration-300"
                 [ngClass]="activeFilter() === 'news' ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-white hover:bg-white/5'">
                 {{ ts.t().publications.categories.news }}
              </button>
              <button (click)="setFilter('analytics')" 
                 class="px-6 py-2 rounded-full transition-all duration-300"
                 [ngClass]="activeFilter() === 'analytics' ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-white hover:bg-white/5'">
                 {{ ts.t().publications.categories.analytics }}
              </button>
              <button (click)="setFilter('digests')" 
                 class="px-6 py-2 rounded-full transition-all duration-300"
                 [ngClass]="activeFilter() === 'digests' ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-white hover:bg-white/5'">
                 {{ ts.t().publications.categories.digests }}
              </button>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 min-h-[300px]">
           
           @if (isLoading()) {
              <div class="col-span-full flex justify-center items-center h-64">
                <span class="material-icons-round animate-spin text-4xl text-white/50">refresh</span>
              </div>
           } @else {
              
              @for (item of displayedItems(); track item.$id) {
                <div class="group flex flex-col h-full glass-card rounded-glass p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all duration-500 bg-white/5 hover:bg-white/10 border border-white/10">
                   
                   <!-- Date & Meta -->
                   <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                      <span class="text-primary-glow">{{ ( item.date || item.createdAt) | date:'MMMM d, y' }}</span>
                      <span class="w-1 h-1 rounded-full bg-white/20"></span>
                      <span class="text-white/60">{{ ts.t().publications.categories[activeFilter()] }}</span>
                   </div>

                   <h3 class="font-serif font-bold text-2xl text-white mb-4 group-hover:text-primary-glow transition-colors leading-tight">
                     {{ item.title }}
                   </h3>
                   
                   <p class="text-stone-300 text-sm leading-relaxed mb-8 line-clamp-3 font-light">
                      {{ item.content || item.desc }}
                   </p>

                   <div class="mt-auto pt-6 border-t border-white/5">
                      @if (item.fileUrl) {
                        <a [href]="item.fileUrl" target="_blank" class="text-primary-glow font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                          <span class="material-icons-round text-lg">download</span> {{ ts.t().publications.downloadPdf }}
                        </a>
                      } @else {
                        <span class="text-white font-bold text-sm group-hover:text-primary-glow transition-colors flex items-center gap-2 cursor-pointer">
                          {{ ts.t().publications.readArticle }} <span class="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </span>
                      }
                   </div>
                </div>
              }

              @if (displayedItems().length === 0) {
                 <div class="col-span-full text-center py-20 px-6 rounded-2xl border border-dashed border-white/20 bg-white/5 max-w-2xl mx-auto flex flex-col items-center mt-12">
                    <svg class="w-24 h-24 text-white/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <h3 class="text-xl font-serif text-white/80 mb-2">{{ ts.t().publications.title }}</h3>
                    <p class="font-sans text-stone-400">{{ ts.t().publications.empty }}</p>
                 </div>
              }
           }
        </div>
      </div>
    </section>
  `
})
export class PublicationsComponent implements OnInit {
   ts = inject(TranslationService);
   data = inject(DataService);

   activeFilter = signal<'analytics' | 'news' | 'digests'>('news');
   isLoading = signal(true);

   newsList = signal<any[]>([]);
   publicationsList = signal<any[]>([]);

   async ngOnInit() {
      this.isLoading.set(true);
      try {
         const [news, pubs] = await Promise.all([
            this.data.getNews(),
            this.data.getPublications()
         ]);

         this.newsList.set(news);
         this.publicationsList.set(pubs);
      } finally {
         this.isLoading.set(false);
      }
   }

   setFilter(filter: 'analytics' | 'news' | 'digests') {
      this.activeFilter.set(filter);
   }

   displayedItems = computed(() => {
      const filter = this.activeFilter();
      if (filter === 'news') return this.newsList();
      if (filter === 'analytics') return this.publicationsList().filter(p => !p.category?.toLowerCase().includes('дайджест'));
      if (filter === 'digests') return this.publicationsList().filter(p => p.category?.toLowerCase().includes('дайджест'));
      return [];
   });
}