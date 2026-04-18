import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-stone-900 pt-32 pb-20 relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10"></div>

      <div class="max-w-4xl mx-auto px-6 relative z-10">

        <!-- Header & User Info -->
        <div class="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <h2 class="text-3xl font-serif text-white">Адмін Панель</h2>
          <div class="flex items-center gap-4">
             <span class="text-stone-400 text-sm">Ввійшов як: <strong class="text-white">{{ currentUser()?.email }}</strong></span>
             <button (click)="logout()" class="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">Вийти</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-4 mb-8">
           <button (click)="activeTab.set('project')"
                   [class.bg-primary]="activeTab() === 'project'" [class.bg-white_10]="activeTab() !== 'project'"
                   class="px-6 py-2 rounded-xl text-white font-bold transition-colors border border-white/10">Додати Проєкт</button>
           <button (click)="activeTab.set('news')"
                   [class.bg-primary]="activeTab() === 'news'" [class.bg-white_10]="activeTab() !== 'news'"
                   class="px-6 py-2 rounded-xl text-white font-bold transition-colors border border-white/10">Додати Новину</button>
           <button (click)="activeTab.set('publication')"
                   [class.bg-primary]="activeTab() === 'publication'" [class.bg-white_10]="activeTab() !== 'publication'"
                   class="px-6 py-2 rounded-xl text-white font-bold transition-colors border border-white/10">Додати Публікацію</button>
        </div>

        <!-- Add Project Form -->
        @if (activeTab() === 'project') {
        <form (ngSubmit)="onSubmitProject()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Назва проєкту</label>
            <input type="text" [(ngModel)]="formData.title" name="title" required
                   class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
          </div>

          <!-- Slug (Auto-generated) -->
          <div>
             <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">URL Slug (генерується автоматично)</label>
             <div class="flex gap-2">
                <input type="text" [ngModel]="formData.slug" (ngModelChange)="formData.slug = $event" name="slug" 
                       class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-stone-300 focus:border-primary focus:outline-none font-mono text-sm">
                <button type="button" (click)="generateSlug()" class="px-4 py-2 glass-button rounded-xl text-white text-sm">
                   Згенерувати
                </button>
             </div>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Тип проєкту</label>
            <select [(ngModel)]="formData.type" name="type" 
                    class="w-full bg-stone-800 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none">
              <option value="donor">Донорський проєкт</option>
              <option value="probono">Pro Bono</option>
            </select>
          </div>

          <!-- Short Description -->
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Короткий опис (для картки)</label>
            <textarea [(ngModel)]="formData.desc" name="desc" rows="3"
                      class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none"></textarea>
          </div>

          <!-- FULL DETAILS (RICH TEXT) -->
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Повний опис (Можна вставляти з Word)</label>
            <div class="flex gap-2 mb-2 p-2 bg-white/5 rounded-t-xl border border-white/10">
               <button type="button" (click)="execCommand('bold')" class="p-2 text-white hover:bg-white/10 rounded" title="Bold"><b>B</b></button>
               <button type="button" (click)="execCommand('italic')" class="p-2 text-white hover:bg-white/10 rounded" title="Italic"><i>I</i></button>
               <button type="button" (click)="execCommand('insertUnorderedList')" class="p-2 text-white hover:bg-white/10 rounded" title="List"><span class="material-icons-round text-sm">format_list_bulleted</span></button>
               <button type="button" (click)="execCommand('formatBlock', 'h3')" class="p-2 text-white hover:bg-white/10 rounded" title="Heading">H3</button>
               <button type="button" (click)="execCommand('removeFormat')" class="p-2 text-white hover:bg-white/10 rounded" title="Clean Scale"><span class="material-icons-round text-sm">format_clear</span></button>
            </div>
            <div #editor 
                 contenteditable="true" 
                 (input)="onEditorInput($event)"
                 (paste)="onPaste($event)"
                 class="w-full bg-white/5 border border-white/20 rounded-b-xl p-6 text-white text-lg focus:border-primary focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto prose prose-invert max-w-none">
            </div>
            <p class="text-xs text-stone-500 mt-2">* При вставці тексту з Word форматування буде очищено для уникнення накладань.</p>
          </div>

          <!-- Main Image -->
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Головне фото</label>
            <input type="file" (change)="onFileSelected($event, 'main')" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-glow">
            @if (previews().main) {
               <div class="mt-4 rounded-xl overflow-hidden border border-white/10 w-48 aspect-video relative group">
                  <img [src]="previews().main" class="w-full h-full object-cover">
               </div>
            }
          </div>

          <!-- Gallery Images -->
           <div class="pt-6 border-t border-white/10">
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Галерея (додаткові фото)</label>
            <input type="file" multiple (change)="onGallerySelected($event)" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-700 file:text-white hover:file:bg-stone-600">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
               @for (item of galleryItems(); track item.id; let i = $index) {
                  <div class="rounded-xl overflow-hidden border border-white/10 aspect-square relative group">
                    <img [src]="item.preview" class="w-full h-full object-cover">
                    <!-- Overlay controls -->
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <div class="flex gap-2">
                        <button type="button" (click)="moveGalleryItem(i, -1)" [disabled]="i === 0" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">
                           <span class="material-icons-round text-sm">arrow_back</span>
                        </button>
                        <button type="button" (click)="moveGalleryItem(i, 1)" [disabled]="i === galleryItems().length - 1" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">
                           <span class="material-icons-round text-sm">arrow_forward</span>
                        </button>
                      </div>
                      <button type="button" (click)="removeGalleryItem(i)" class="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center">
                         <span class="material-icons-round text-sm">delete</span>
                      </button>
                    </div>
                  </div>
               }
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-8">
            <button type="submit" [disabled]="isSubmitting" 
                    class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
              {{ isSubmitting ? 'Публікація...' : 'Опублікувати проєкт' }}
            </button>
          </div>
        </form>
        }

        <!-- Add News Form -->
        @if (activeTab() === 'news') {
        <form (ngSubmit)="onSubmitNews()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Заголовок новини</label>
            <input type="text" [(ngModel)]="newsData.title" name="newsTitle" required
                   class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
          </div>
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Опис</label>
            <textarea [(ngModel)]="newsData.desc" name="newsDesc" rows="4" required
                      class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none"></textarea>
          </div>
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Дата (наприклад: 2024-03-15)</label>
            <input type="date" [(ngModel)]="newsData.date" name="newsDate" required
                   class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
          </div>
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Фото новини (необов'язково)</label>
            <input type="file" (change)="onFileSelected($event, 'news')" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-glow">
            @if (previews().news) {
               <div class="mt-4 rounded-xl overflow-hidden border border-white/10 w-48 aspect-video relative group">
                  <img [src]="previews().news" class="w-full h-full object-cover">
               </div>
            }
          </div>
          <div class="pt-8">
            <button type="submit" [disabled]="isSubmitting"
                    class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
              {{ isSubmitting ? 'Збереження...' : 'Додати новину' }}
            </button>
          </div>
        </form>
        }

        <!-- Add Publication/Digest Form -->
        @if (activeTab() === 'publication') {
        <form (ngSubmit)="onSubmitPublication()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Заголовок публікації</label>
            <input type="text" [(ngModel)]="pubData.title" name="pubTitle" required
                   class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
          </div>
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Категорія</label>
            <select [(ngModel)]="pubData.category" name="pubCat"
                    class="w-full bg-stone-800 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none">
              <option value="Аналітичні звіти">Аналітичний звіт</option>
              <option value="Дайджест">Дайджест</option>
            </select>
          </div>
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Короткий опис</label>
            <textarea [(ngModel)]="pubData.desc" name="pubDesc" rows="3" required
                      class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none"></textarea>
          </div>
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Посилання (Лінк)</label>
            <input type="text" [(ngModel)]="pubData.link" name="pubLink"
                   class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
          </div>
          <div class="pt-8">
            <button type="submit" [disabled]="isSubmitting"
                    class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
              {{ isSubmitting ? 'Збереження...' : 'Додати публікацію' }}
            </button>
          </div>
        </form>
        }

      </div>
    </div>
  `
})
export class AdminProjectComponent implements OnInit {
  private data = inject(DataService);
  private router = inject(Router);

  currentUser = signal<{email: string} | null>(null);
  activeTab = signal<'project' | 'news' | 'publication'>('project');

  formData = {
    title: '',
    slug: '',
    desc: '',
    details: '', // Stores HTML
    type: 'donor'
  };

  newsData = {
    title: '',
    desc: '',
    date: new Date().toISOString().split('T')[0],
  };

  pubData = {
    title: '',
    category: 'Аналітичні звіти',
    desc: '',
    link: ''
  };

  selectedFile: File | null = null;
  newsFile: File | null = null;

  // Unified state for gallery items
  galleryItems = signal<{id: string, preview: string, file: File}[]>([]);

  isSubmitting = false;
  previews = signal<{ main: string | null, news: string | null }>({ main: null, news: null });

  async ngOnInit() {
    const user = await this.data.getCurrentUser();
    this.currentUser.set(user);
    if (!user) {
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    await this.data.logout();
    this.router.navigate(['/login']);
  }

  // --- Rich Text Helper ---
  execCommand(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
  }

  onEditorInput(event: Event) {
    const target = event.target as HTMLElement;
    this.formData.details = target.innerHTML;
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';

    // Instead of raw text, we replace double newlines with paragraphs and single newlines with br
    // But since execCommand insertText escapes HTML, we can just insert plain text and it will preserve line breaks
    // as text nodes and <br>s inside the contenteditable.
    document.execCommand('insertText', false, text);
  }
  // ------------------------

  generateSlug() {
    const ukrMap: any = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e',
      'є': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y',
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
      'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya', ' ': '-'
    };

    const titleLower = this.formData.title.toLowerCase();

    this.formData.slug = titleLower.split('').map(char => {
      if (ukrMap[char] !== undefined) return ukrMap[char];
      if (/[a-z0-9-]/.test(char)) return char;
      return '';
    }).join('').replace(/-+/g, '-');
  }

  onFileSelected(event: any, type: 'main' | 'news') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'main') {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => this.previews.update(p => ({ ...p, main: e.target.result }));
        reader.readAsDataURL(file);
      } else {
        this.newsFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => this.previews.update(p => ({ ...p, news: e.target.result }));
        reader.readAsDataURL(file);
      }
    }
  }

  onGallerySelected(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];

      const newItemsPromises = files.map(file => {
        return new Promise<any>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
             resolve({
                id: `new-${Date.now()}-${Math.random()}`,
                preview: e.target.result,
                file: file
             });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newItemsPromises).then(newItems => {
        this.galleryItems.update(items => [...items, ...newItems]);
      });

      // Clear input so same files can be selected again if needed
      event.target.value = '';
    }
  }

  removeGalleryItem(index: number) {
    this.galleryItems.update(items => {
      const newItems = [...items];
      newItems.splice(index, 1);
      return newItems;
    });
  }

  moveGalleryItem(index: number, direction: number) {
    this.galleryItems.update(items => {
      const newItems = [...items];
      if (index + direction >= 0 && index + direction < newItems.length) {
        const temp = newItems[index];
        newItems[index] = newItems[index + direction];
        newItems[index + direction] = temp;
      }
      return newItems;
    });
  }

  async onSubmitProject() {
    if (!this.formData.title || !this.selectedFile) {
      alert('Будь ласка, заповніть назву та додайте головне фото.');
      return;
    }
    this.isSubmitting = true;
    try {
      // Auto-generate slug if it is empty
      if (!this.formData.slug) {
        this.generateSlug();

        // If it's still empty for some reason (e.g. only symbols), generate a random one
        if (!this.formData.slug) {
          this.formData.slug = 'project-' + Date.now();
        }
      }

      const imageUrl = await this.data.uploadFile(this.selectedFile);

      const currentItems = this.galleryItems();
      const uploadPromises = currentItems.map(item => this.data.uploadFile(item.file));
      const galleryUrls = await Promise.all(uploadPromises);

      await this.data.createProject({
        title: this.formData.title,
        slug: this.formData.slug,
        desc: this.formData.desc,
        details: this.formData.details,
        type: this.formData.type,
        image: imageUrl,
        gallery: galleryUrls,
        date: new Date().toISOString()
      });
      alert('Проєкт успішно створено!');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error creating project', error);
      alert('Помилка при створенні проєкту');
    } finally {
      this.isSubmitting = false;
    }
  }

  async onSubmitNews() {
    if (!this.newsData.title) {
      alert('Будь ласка, заповніть назву.');
      return;
    }
    this.isSubmitting = true;
    try {
      let imageUrl = null;
      if (this.newsFile) {
        imageUrl = await this.data.uploadFile(this.newsFile);
      }
      await this.data.addNews({
        ...this.newsData,
        image: imageUrl
      });
      alert('Новину успішно додано!');
      this.newsData = { title: '', desc: '', date: new Date().toISOString().split('T')[0] };
      this.newsFile = null;
      this.previews.update(p => ({ ...p, news: null }));
    } catch (error) {
      console.error('Error creating news', error);
      alert('Помилка при створенні новини');
    } finally {
      this.isSubmitting = false;
    }
  }

  async onSubmitPublication() {
    if (!this.pubData.title) {
      alert('Будь ласка, заповніть назву.');
      return;
    }
    this.isSubmitting = true;
    try {
      await this.data.addPublication(this.pubData);
      alert('Публікацію успішно додано!');
      this.pubData = { title: '', desc: '', link: '', category: 'Аналітичні звіти' };
    } catch (error) {
      console.error('Error creating publication', error);
      alert('Помилка при створенні публікації');
    } finally {
      this.isSubmitting = false;
    }
  }
}
