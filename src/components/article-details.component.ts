import { Component, OnInit, signal, inject, computed, SecurityContext } from '@angular/core';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="min-h-screen bg-[#0c0a09] pt-32 pb-24 relative overflow-hidden font-sans">

      <!-- Background Elements -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      @if (isLoading()) {
        <div class="flex justify-center items-center h-64 relative z-10">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <div class="absolute inset-2 rounded-full border-r-2 border-accent animate-spin-reverse"></div>
          </div>
        </div>
      }

      @if (!isLoading() && article()) {
        <article class="max-w-5xl mx-auto px-6 md:px-12 relative z-10 animate-fade-in">

          <!-- TOP Navigation -->
          <button (click)="goBack()" class="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-12 group">
             <span class="material-icons-round text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
             <span class="uppercase tracking-widest text-xs font-bold">Назад</span>
          </button>

          <div class="flex flex-col items-center">

            <!-- HEADER -->
            <header class="w-full mb-12">
               <div class="flex flex-wrap items-center gap-4 mb-6">
                  <span class="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary-glow">
                    {{ type() === 'news' ? 'Новина' : article().category || 'Публікація' }}
                  </span>
                  <span class="text-stone-500 text-sm flex items-center gap-2">
                    <span class="material-icons-round text-sm">calendar_today</span>
                    {{ (article().date || article().createdAt) | date:'MMMM d, y' }}
                  </span>
               </div>

               <h1 class="text-4xl md:text-6xl font-serif text-white font-bold drop-shadow-2xl leading-tight">
                  {{ article().title }}
               </h1>

               @if (currentUser()) {
                 <div class="mt-6 flex justify-center w-full">
                   <a [routerLink]="[type() === 'news' ? '/admin/edit-news' : '/admin/edit-publication', article().$id]" class="inline-flex items-center gap-2 px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1">
                     <span class="material-icons-round text-sm">edit</span> Редагувати
                   </a>
                 </div>
               }
            </header>

            <!-- Main Image -->
            @if (article().image) {
              <div class="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl relative group w-full mb-12">
                <div class="relative w-full aspect-video md:aspect-[21/9] bg-[#0c0a09] flex items-center justify-center select-none">
                  <img [src]="article().image" class="max-w-full max-h-full object-contain drop-shadow-2xl">
                </div>
              </div>
            }

            <!-- Main Text Panel (Full Width) -->
            <div class="glass-panel p-8 md:p-16 rounded-3xl border border-white/5 bg-stone-900/30 w-full mb-12">
               @if (article().desc && !sanitizedDetails) {
                 <p class="text-xl md:text-2xl text-stone-200 leading-relaxed font-light border-l-4 border-accent pl-8">
                  {{ article().desc }}
                 </p>
               }

               @if (sanitizedDetails) {
                <div class="prose prose-xl md:prose-2xl prose-invert max-w-none text-stone-300 leading-loose prose-headings:font-serif prose-headings:text-white prose-a:text-accent prose-strong:text-white prose-li:marker:text-accent">
                   <div [innerHTML]="sanitizedDetails"></div>
                </div>
               }

               @if (article().link) {
                 <div class="mt-12">
                    <a [href]="article().link" target="_blank" class="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1">
                      <span class="material-icons-round">link</span> Читати в оригіналі / Переглянути звіт
                    </a>
                 </div>
               }
            </div>

            <!-- Share Card -->
            <div class="glass-panel p-10 rounded-3xl border border-white/5 bg-stone-900/40 flex flex-col justify-center items-center text-center w-full max-w-2xl">
               <span class="material-icons-round text-5xl text-stone-500 mb-6">share</span>
               <h3 class="text-2xl font-serif text-white mb-8">Поділитися статтею</h3>
               <div class="flex gap-6">
                  <button class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary border border-white/5 hover:border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                     <i class="fab fa-facebook-f text-2xl"></i>
                  </button>
                  <button class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 hover:text-sky-400 border border-white/5 hover:border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                     <i class="fab fa-twitter text-2xl"></i>
                  </button>
                  <button class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-600 border border-white/5 hover:border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                     <i class="fab fa-linkedin-in text-2xl"></i>
                  </button>
               </div>
            </div>

          </div>
        </article>
      }

      @if (!isLoading() && !article()) {
        <div class="text-center py-32 px-4 relative z-10">
            <span class="material-icons-round text-6xl text-stone-600 mb-6">search_off</span>
            <h2 class="text-2xl font-serif text-white mb-4">Статтю не знайдено</h2>
            <a routerLink="/publications" class="text-accent hover:text-accent-glow underline underline-offset-4">Повернутися до новин</a>
        </div>
      }
    </div>
  `
})
export class ArticleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);

  article = signal<any>(null);
  isLoading = signal(true);
  sanitizedDetails: string = '';
  type = signal<'news'|'publication'>('news');
  currentUser = signal<{email: string} | null>(null);

  async ngOnInit() {
    const user = await this.data.getCurrentUser();
    this.currentUser.set(user);

    const id = this.route.snapshot.paramMap.get('id');
    const path = this.route.snapshot.url[0].path;
    this.type.set(path === 'news' ? 'news' : 'publication');

    if (id) {
      try {
        let data;
        if (this.type() === 'news') {
           data = await this.data.getNewsById(id);
        } else {
           data = await this.data.getPublicationById(id);
        }

        if (data) {
          this.setArticle(data);
        }
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Article loading failed', error);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.isLoading.set(false);
    }
  }

  private setArticle(data: any) {
    this.article.set(data);
    const details = data.details || ''; // Using desc for short intro, details for long if exists
    if (details) {
      if (details.includes('<') && details.includes('>')) {
        this.sanitizedDetails = this.sanitizer.sanitize(SecurityContext.HTML, details) ?? '';
      } else {
        const htmlArr = details.split('\n').filter((p: string) => p.trim() !== '').map((p: string) => `<p>${p}</p>`).join('');
        this.sanitizedDetails = this.sanitizer.sanitize(SecurityContext.HTML, htmlArr) ?? '';
      }
    }
  }

  goBack() {
    this.location.back();
  }
}
