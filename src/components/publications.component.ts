import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslationService } from '../services/translation.service';
import { AppwriteService } from '../services/appwrite.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, DatePipe], // Додали DatePipe для красивих дат
  template: `
    <section id="publications" class="py-20 bg-white text-slate-800">
      <div class="max-w-7xl mx-auto px-4">
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 class="text-3xl font-bold text-brand-dark">{{ ts.t().publications.title }}</h2>
          
          <div class="flex flex-wrap justify-center gap-2 p-1 bg-slate-100 rounded-xl">
            
            <button 
              (click)="setFilter('analytics')"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300"
              [class]="activeFilter() === 'analytics' ? 'bg-white text-brand-orange shadow-md' : 'text-slate-500 hover:text-slate-700'"
            >
              Аналітика
            </button>

            <button 
              (click)="setFilter('news')"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300"
              [class]="activeFilter() === 'news' ? 'bg-white text-brand-orange shadow-md' : 'text-slate-500 hover:text-slate-700'"
            >
              Новини
            </button>

            <button 
              (click)="setFilter('digests')"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300"
              [class]="activeFilter() === 'digests' ? 'bg-white text-brand-orange shadow-md' : 'text-slate-500 hover:text-slate-700'"
            >
              Дайджести
            </button>

          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
           
           @if (isLoading()) {
              <div class="col-span-full flex justify-center items-center h-64">
                <span class="material-icons-round animate-spin text-4xl text-brand-orange">refresh</span>
              </div>
           } @else {
              
              @for (item of displayedItems(); track item.$id) {
                <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                   
                   <div *ngIf="item.image" class="h-48 w-full bg-slate-100 overflow-hidden relative">
                      <img [src]="item.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-brand-dark">
                        {{ item.$createdAt | date:'dd.MM.yyyy' }}
                      </div>
                   </div>

                   <div class="p-6 flex flex-col flex-grow">
                     
                     <div *ngIf="!item.image" class="text-xs font-bold text-slate-400 mb-2">
                        {{ item.$createdAt | date:'dd.MM.yyyy' }}
                     </div>

                     <h3 class="text-xl font-bold text-brand-dark mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
                       {{ item.title }}
                     </h3>
                     
                     <p class="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
                        {{ item.content || item.desc || 'Натисніть, щоб переглянути деталі...' }}
                     </p>

                     <div class="mt-auto pt-4 border-t border-slate-100">
                        <a *ngIf="item.fileUrl" [href]="item.fileUrl" target="_blank" class="flex items-center gap-2 text-brand-orange font-bold text-sm hover:gap-3 transition-all">
                           <span class="material-icons-round">download</span>
                           Завантажити PDF
                        </a>

                        <span *ngIf="!item.fileUrl" class="flex items-center gap-2 text-brand-dark font-bold text-sm group-hover:text-brand-orange transition-colors">
                           Читати далі
                           <span class="material-icons-round text-sm">arrow_forward</span>
                        </span>
                     </div>
                   </div>
                </div>
              }

              @if (displayedItems().length === 0) {
                 <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <span class="material-icons-round text-4xl mb-2 text-slate-300">folder_off</span>
                    <p>У категорії "{{ activeFilter() }}" поки немає матеріалів.</p>
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
  appwrite = inject(AppwriteService);

  // 1. Стан фільтра (за замовчуванням 'news')
  activeFilter = signal<'analytics' | 'news' | 'digests'>('news');
  
  isLoading = signal(true);
  
  // 2. Сховища даних
  newsList = signal<any[]>([]);
  publicationsList = signal<any[]>([]);

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      // Завантажуємо все одразу паралельно
      const [news, pubs] = await Promise.all([
        this.appwrite.getNews(),
        this.appwrite.getPublications()
      ]);
      
      this.newsList.set(news);
      this.publicationsList.set(pubs);
    } finally {
      this.isLoading.set(false);
    }
  }

  // 3. Функція перемикання кнопок
  setFilter(filter: 'analytics' | 'news' | 'digests') {
    this.activeFilter.set(filter);
  }

  // 4. "Розумний" список (Computed), який сам вирішує, що показувати
  displayedItems = computed(() => {
    const filter = this.activeFilter();

    if (filter === 'news') {
      // Показуємо новини
      return this.newsList();
    } 
    else if (filter === 'analytics') {
      // Показуємо Публікації, де категорія НЕ "Дайджест" (або містить "Аналітика")
      // Поки що показуємо всі публікації, крім дайджестів, щоб не було пусто
      return this.publicationsList().filter(p => !p.category?.toLowerCase().includes('дайджест'));
    } 
    else if (filter === 'digests') {
      // Показуємо тільки Дайджести
      return this.publicationsList().filter(p => p.category?.toLowerCase().includes('дайджест'));
    }
    
    return [];
  });
}