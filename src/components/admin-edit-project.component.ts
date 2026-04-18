import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-edit-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark pt-32 pb-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
           <button (click)="goBack()" class="text-stone-400 hover:text-white transition-colors">
             <span class="material-icons-round text-3xl">arrow_back</span>
           </button>
           <h2 class="text-4xl font-serif text-white">Редагувати проєкт</h2>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center items-center py-20">
            <span class="material-icons-round animate-spin text-4xl text-primary">refresh</span>
          </div>
        } @else if (project()) {
          <form (ngSubmit)="onSubmit()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Назва проєкту</label>
              <input type="text" [(ngModel)]="formData.title" name="title" (ngModelChange)="generateSlug()" required
                     class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">URL (slug)</label>
              <input type="text" [(ngModel)]="formData.slug" name="slug"
                     class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
              <p class="text-xs text-stone-500 mt-1">Змінюйте обережно, адже це впливає на посилання</p>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Тип проєкту</label>
              <select [(ngModel)]="formData.type" name="type"
                      class="w-full bg-stone-800 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none">
                <option value="donor">Донорський</option>
                <option value="commercial">Комерційний</option>
              </select>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Короткий опис</label>
              <textarea [(ngModel)]="formData.desc" name="desc" rows="3" required
                        class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"></textarea>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Детальний опис</label>
              <div class="mb-2 flex flex-wrap gap-2 bg-stone-800 p-2 rounded-lg border border-white/10">
                 <button type="button" (click)="execCommand('bold')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white font-bold">B</button>
                 <button type="button" (click)="execCommand('italic')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white italic">I</button>
                 <button type="button" (click)="execCommand('underline')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white underline">U</button>
                 <button type="button" (click)="execCommand('insertUnorderedList')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white flex items-center"><span class="material-icons-round text-sm">format_list_bulleted</span></button>
                 <button type="button" (click)="execCommand('insertOrderedList')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white flex items-center"><span class="material-icons-round text-sm">format_list_numbered</span></button>
                 <button type="button" (click)="execCommand('createLink', promptLink())" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white flex items-center"><span class="material-icons-round text-sm">link</span></button>
                 <button type="button" (click)="execCommand('unlink')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white flex items-center"><span class="material-icons-round text-sm">link_off</span></button>
                 <button type="button" (click)="execCommand('formatBlock', 'H2')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white font-serif">H2</button>
                 <button type="button" (click)="execCommand('formatBlock', 'H3')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white font-serif">H3</button>
              </div>

              <div class="w-full min-h-[200px] bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none prose prose-invert max-w-none prose-a:text-accent"
                   contenteditable="true"
                   [innerHTML]="formData.details"
                   (input)="onEditorInput($event)"
                   (paste)="onPaste($event)">
              </div>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Головне фото (залиште пустим, щоб не змінювати)</label>
              <input type="file" (change)="onFileSelected($event, 'main')" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-glow">
              @if (previews().main) {
                 <div class="mt-4 rounded-xl overflow-hidden border border-white/10 w-48 aspect-video relative group">
                    <img [src]="previews().main" class="w-full h-full object-cover">
                 </div>
              } @else if (project()?.image) {
                  <div class="mt-4 rounded-xl overflow-hidden border border-white/10 w-48 aspect-video relative group">
                    <img [src]="project().image" class="w-full h-full object-cover">
                 </div>
              }
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Галерея фото</label>
              <input type="file" multiple (change)="onGallerySelected($event)" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-700 file:text-white hover:file:bg-stone-600">

              <div class="mt-4 flex flex-wrap gap-4">
                 @for (item of galleryItems(); track item.id; let i = $index) {
                   <div class="w-32 h-32 rounded-lg overflow-hidden border border-white/10 relative group">
                      <img [src]="item.preview" class="w-full h-full object-cover">

                      @if (item.isNew) {
                         <div class="absolute top-1 left-1 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">НОВЕ</div>
                      }

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
                 @if (galleryItems().length === 0) {
                    <div class="text-stone-500 text-sm">Немає фото в галереї</div>
                 }
              </div>
            </div>

            <div class="pt-8">
              <button type="submit" [disabled]="isSubmitting"
                      class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
                {{ isSubmitting ? 'Збереження...' : 'Зберегти зміни' }}
              </button>
            </div>
          </form>
        } @else {
          <div class="text-center py-20 text-white">Проєкт не знайдено.</div>
        }
      </div>
    </div>
  `
})
export class AdminEditProjectComponent implements OnInit {
  private data = inject(DataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(true);
  project = signal<any>(null);

  formData = {
    title: '',
    slug: '',
    desc: '',
    details: '',
    type: 'donor'
  };

  selectedFile: File | null = null;

  // Unified state for gallery items
  // An item is either an existing URL (isNew: false) or a newly selected File (isNew: true)
  galleryItems = signal<{id: string, preview: string, isNew: boolean, url?: string, file?: File}[]>([]);

  isSubmitting = false;
  previews = signal<{ main: string | null }>({ main: null });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      this.isLoading.set(false);
      return;
    }

    try {
      let proj = null;
      if (id.length === 20 && !id.includes('-')) {
        try {
          proj = await this.data.getProjectById(id);
        } catch (e) {
          proj = await this.data.getProjectBySlug(id);
        }
      } else {
        proj = await this.data.getProjectBySlug(id);
      }

      if (proj) {
        this.project.set(proj);
        this.formData = {
          title: proj.title || '',
          slug: proj.slug || '',
          desc: proj.desc || '',
          details: proj.details || '',
          type: proj.type || 'donor'
        };

        // Initialize gallery state with existing items
        if (proj.gallery && Array.isArray(proj.gallery)) {
          const items = proj.gallery.map((url: string, index: number) => ({
             id: `existing-${index}`,
             preview: url,
             isNew: false,
             url: url
          }));
          this.galleryItems.set(items);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    if (this.project()?.slug) {
        this.router.navigate(['/project', this.project().slug]);
    } else {
        this.router.navigate(['/']);
    }
  }

  execCommand(command: string, value: string | undefined = undefined) {
    // Note: document.execCommand is deprecated but still widely supported for basic contenteditable needs.
    // In the future, consider replacing this with a dedicated rich-text editor library (e.g. Quill, TinyMCE).
    document.execCommand(command, false, value);
  }

  promptLink() {
    return prompt('Введіть URL:') || undefined;
  }

  onEditorInput(event: Event) {
    const target = event.target as HTMLElement;
    this.formData.details = target.innerHTML;
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
  }

  generateSlug() {
    if (!this.formData.slug && this.formData.title) {
      this.formData.slug = DataService.generateSlugFromTitle(this.formData.title);
    }
  }

  onFileSelected(event: any, type: 'main') {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previews.update(p => ({ ...p, main: e.target.result }));
      reader.readAsDataURL(file);
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
                isNew: true,
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

  async onSubmit() {
    if (!this.formData.title) {
      alert('Будь ласка, заповніть назву.');
      return;
    }
    this.isSubmitting = true;
    try {
      const updateData: any = {
        title: this.formData.title,
        slug: this.formData.slug,
        desc: this.formData.desc,
        details: this.formData.details,
        type: this.formData.type
      };

      if (this.selectedFile) {
        updateData.image = await this.data.uploadFile(this.selectedFile);
      }

      // Process gallery items in their current order
      const currentItems = this.galleryItems();

      // Upload new files, keep existing URLs
      const uploadPromises = currentItems.map(async (item) => {
         if (item.isNew && item.file) {
            return await this.data.uploadFile(item.file);
         } else if (!item.isNew && item.url) {
            return item.url;
         }
         return null;
      });

      const resolvedUrls = await Promise.all(uploadPromises);
      // Filter out any potential nulls
      updateData.gallery = resolvedUrls.filter(url => url !== null);

      await this.data.updateProject(this.project().$id, updateData);
      alert('Проєкт успішно оновлено!');
      this.goBack();
    } catch (error) {
      console.error('Error updating project', error);
      alert('Помилка при оновленні проєкту');
    } finally {
      this.isSubmitting = false;
    }
  }
}
