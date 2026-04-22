import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ROOT: Main scroll container (Remove overflow-hidden from here to allow sticky) -->
    <div class="min-h-screen bg-[#1c1917] relative">
      
      <!-- FIXED BACKGROUND LAYER (Handles overflow for blobs) -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div class="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent/15 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
          <div class="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
          <div class="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen animate-float"></div>
          <div class="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10"></div>
      </div>

      @if (isLoading()) {
        <div class="flex flex-col justify-center items-center h-screen gap-4 relative z-10">
          <div class="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span class="text-accent/80 font-serif tracking-widest text-sm uppercase">Завантаження...</span>
        </div>
      }

      @if (!isLoading() && project()) {
        <!-- ARTICLE: Increased width to 95% for "100% layout" feel -->
        <article class="w-[95%] max-w-[1800px] mx-auto pt-24 pb-20 px-4 sm:px-6 relative z-10 animate-fade-in">
          
          <!-- Navigation -->
          <nav class="flex items-center justify-between mb-8">
            <a routerLink="/" fragment="projects" class="inline-flex items-center text-stone-400 hover:text-white transition-colors group">
              <span class="material-icons-round mr-2 text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span class="uppercase tracking-widest text-sm font-bold">Усі проєкти</span>
            </a>
          </nav>

          <!-- MAIN LAYOUT: Single Vertical Column (Everything Full Width) -->
          <div class="w-full flex flex-col gap-16 md:gap-24">
            
            <!-- TOP SECTION: Header + Gallery + Text -->
            <div class="w-full flex flex-col gap-10">
              
              <!-- Header -->
              <header class="text-left animate-slide-up">
                 <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent/20 text-accent border border-accent/20 shadow-[0_0_15px_rgba(217,119,54,0.2)] mb-4 inline-block">
                    {{ project().type === 'donor' ? 'Донорський проєкт' : 'Pro Bono' }}
                 </span>
                 <h1 class="text-4xl md:text-5xl lg:text-7xl font-serif text-white drop-shadow-2xl leading-tight">
                    {{ project().title }}
                 </h1>
                 @if (currentUser()) {
                   <div class="mt-6 flex justify-center w-full">
                     <a [routerLink]="['/admin/edit-project', project().$id]" class="inline-flex items-center gap-2 px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1">
                       <span class="material-icons-round text-sm">edit</span> Редагувати
                     </a>
                   </div>
                 }
              </header>

              <!-- HERO GALLERY CAROUSEL (Full Width) -->
              <div class="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl relative group w-full">
                
                <!-- Main Display Area -->
                <div class="relative w-full aspect-video md:aspect-[21/9] bg-[#0c0a09] flex items-center justify-center select-none">
                  
                  <!-- Current Image -->
                  <img [src]="currentImage()" class="max-w-full max-h-full object-contain transition-opacity duration-300 drop-shadow-2xl" 
                       [class.opacity-100]="!isTransitioning()" [class.opacity-0]="isTransitioning()">
                  
                  <!-- Navigation -->
                  <button (click)="prevImage()" aria-label="Previous image" class="absolute left-4 w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-lg z-20">
                    <span class="material-icons-round text-3xl">chevron_left</span>
                  </button>
                  <button (click)="nextImage()" aria-label="Next image" class="absolute right-4 w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-lg z-20">
                    <span class="material-icons-round text-3xl">chevron_right</span>
                  </button>
                </div>

                <!-- Thumbnail Strip -->
                @if (allImages().length > 1) {
                  <div class="py-6 px-4 bg-[#151210] border-t border-white/5 overflow-x-auto custom-scrollbar">
                     <div class="flex gap-4 min-w-max px-4 mx-auto">
                        @for (img of allImages(); track img; let i = $index) {
                           <button (click)="setImage(i)" 
                                   class="relative w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden transition-all duration-300 border-2"
                                   [class.border-accent]="i === activeIndex()"
                                   [class.shadow-[0_0_20px_rgba(217,119,54,0.4)]]="i === activeIndex()"
                                   [class.opacity-40]="i !== activeIndex()"
                                   [class.hover:opacity-80]="i !== activeIndex()"
                                   [class.border-transparent]="i !== activeIndex()">
                              <img [src]="img" class="w-full h-full object-cover">
                           </button>
                        }
                     </div>
                  </div>
                }
              </div>

              <!-- Main Text Panel (Full Width) -->
              <div class="glass-panel p-8 md:p-16 rounded-3xl border border-white/5 bg-stone-900/30">
                 <p class="text-xl md:text-3xl text-stone-200 mb-16 leading-relaxed font-light border-l-4 border-accent pl-10 italic max-w-5xl">
                  {{ project().desc }}
                </p>

                <div class="prose prose-xl md:prose-2xl prose-invert max-w-none text-stone-300 leading-loose prose-headings:font-serif prose-headings:text-white prose-a:text-accent prose-strong:text-white prose-li:marker:text-accent">
                   <div [innerHTML]="sanitizedDetails"></div>
                </div>
              </div>
            
            </div>

            <!-- BOTTOM SECTION: Support & Share -->
            <div class="grid md:grid-cols-2 gap-8 w-full animate-slide-up-delay">
               <!-- Support Card -->
               <div class="glass-panel p-10 rounded-3xl border border-white/5 bg-accent/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-4 mb-6">
                      <div class="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                         <span class="material-icons-round text-4xl">volunteer_activism</span>
                      </div>
                      <h3 class="text-3xl font-serif text-white">Підтримати проєкт</h3>
                    </div>
                    
                    <p class="text-stone-300 text-lg mb-10 leading-relaxed">
                      Ваша підтримка є вирішальною для нас. Долучайтеся до створення змін та допоможіть нам реалізувати цілі цього проєкту.
                    </p>
                  </div>
                  
                  <button class="w-full py-6 bg-accent hover:bg-accent-glow text-white font-bold rounded-2xl shadow-[0_4px_30px_rgba(217,119,54,0.4)] hover:shadow-[0_8px_40px_rgba(217,119,54,0.6)] hover:-translate-y-1 transition-all uppercase tracking-widest text-lg flex items-center justify-center gap-3 group">
                    <span>Підтримати зараз</span>
                    <span class="material-icons-round group-hover:scale-110 transition-transform">favorite</span>
                  </button>
               </div>

               <!-- Share Card -->
               <div class="glass-panel p-10 rounded-3xl border border-white/5 bg-stone-900/40 flex flex-col justify-center items-center text-center">
                  <span class="material-icons-round text-5xl text-stone-500 mb-6">share</span>
                  <h3 class="text-2xl font-serif text-white mb-8">Поділитися проєктом</h3>
                  <div class="flex gap-6">
                     <button aria-label="Share on Facebook" class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary border border-white/5 hover:border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                        <i class="fab fa-facebook-f text-2xl"></i>
                     </button>
                     <button aria-label="Share on Twitter" class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 hover:text-sky-400 border border-white/5 hover:border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                        <i class="fab fa-twitter text-2xl"></i>
                     </button>
                     <button aria-label="Share on LinkedIn" class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-600 border border-white/5 hover:border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                        <i class="fab fa-linkedin-in text-2xl"></i>
                     </button>
                  </div>
               </div>
            </div>

          </div>


        </article>
      }

      @if (!isLoading() && !project()) {
        <div class="text-center py-32 px-4 relative z-10">
            <span class="material-icons-round text-6xl text-stone-600 mb-6">search_off</span>
            <h2 class="text-2xl font-serif text-white mb-4">Проєкт не знайдено</h2>
            <a routerLink="/" class="text-accent hover:text-accent-glow underline underline-offset-4">Повернутися на головну</a>
        </div>
      }
    </div>
  `
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);

  project = signal<any>(null);
  isLoading = signal(true);
  sanitizedDetails: string = '';
  currentUser = signal<{email: string} | null>(null);

  // Gallery Logic
  activeIndex = signal(0);
  isTransitioning = signal(false);

  // Computed list of ALL images (Main + Gallery)
  allImages = computed(() => {
    const proj = this.project();
    if (!proj) return [];

    // Use Set to prevent duplicates if Main Image is also in Gallery
    const uniqueImgs = new Set<string>();

    if (proj.image) uniqueImgs.add(proj.image);

    if (proj.gallery && Array.isArray(proj.gallery)) {
      proj.gallery.forEach((img: string) => uniqueImgs.add(img));
    }

    return Array.from(uniqueImgs);
  });

  currentImage = computed(() => {
    const images = this.allImages();
    if (images.length === 0) return '';
    return images[this.activeIndex()];
  });

  async ngOnInit() {
    const user = await this.data.getCurrentUser();
    this.currentUser.set(user);

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      try {
        // Appwrite IDs are usually 20 chars long, slugs are usually not exactly 20 chars and contain hyphens.
        // Doing a length/pattern check prevents a useless 400 bad request in the console.
        let data = null;
        if (id.length === 20 && !id.includes('-')) {
          try {
             data = await this.data.getProjectById(id) as any;
          } catch (e) {
             // Fallback to slug if ID fails
             data = await this.data.getProjectBySlug(id);
          }
        } else {
           data = await this.data.getProjectBySlug(id);
        }

        if (data) {
          this.setProject(data);
          if (data['slug'] && data['slug'] !== id) {
            this.location.replaceState(`/project/${data['slug']}`);
          }
        } else {
          console.error('Project not found');
        }
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Project loading failed', error);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.isLoading.set(false);
    }
  }

  private setProject(data: any) {
    this.project.set(data);
    const details = data.details || data.desc || '';
    if (details.includes('<') && details.includes('>')) {
      this.sanitizedDetails = this.sanitizer.sanitize(SecurityContext.HTML, details) ?? '';
    } else {
      const htmlArr = details.split('\n').filter((p: string) => p.trim() !== '').map((p: string) => `<p>${p}</p>`).join('');
      this.sanitizedDetails = this.sanitizer.sanitize(SecurityContext.HTML, htmlArr) ?? '';
    }
  }

  // --- Carousel Methods ---
  prevImage() {
    const total = this.allImages().length;
    if (total <= 1) return;
    this.activeIndex.update(i => (i - 1 + total) % total);
  }

  nextImage() {
    const total = this.allImages().length;
    if (total <= 1) return;
    this.activeIndex.update(i => (i + 1) % total);
  }

  setImage(index: number) {
    this.activeIndex.set(index);
  }
}