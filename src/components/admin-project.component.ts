import { Component, inject, signal } from '@angular/core';
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
        <h2 class="text-3xl font-serif text-white mb-8">Додати новий проєкт</h2>

        <form (ngSubmit)="onSubmit()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
          
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
            
            <!-- Toolbar -->
            <div class="flex gap-2 mb-2 p-2 bg-white/5 rounded-t-xl border border-white/10">
               <button type="button" (click)="execCommand('bold')" class="p-2 text-white hover:bg-white/10 rounded" title="Bold"><b>B</b></button>
               <button type="button" (click)="execCommand('italic')" class="p-2 text-white hover:bg-white/10 rounded" title="Italic"><i>I</i></button>
               <button type="button" (click)="execCommand('insertUnorderedList')" class="p-2 text-white hover:bg-white/10 rounded" title="List"><span class="material-icons-round text-sm">format_list_bulleted</span></button>
               <button type="button" (click)="execCommand('formatBlock', 'h3')" class="p-2 text-white hover:bg-white/10 rounded" title="Heading">H3</button>
               <button type="button" (click)="execCommand('removeFormat')" class="p-2 text-white hover:bg-white/10 rounded" title="Clean Scale"><span class="material-icons-round text-sm">format_clear</span></button>
            </div>

            <!-- Content Editable Div -->
            <div #editor 
                 contenteditable="true" 
                 (input)="onEditorInput($event)"
                 class="w-full bg-white/5 border border-white/20 rounded-b-xl p-6 text-white text-lg focus:border-primary focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto prose prose-invert max-w-none">
            </div>
            <p class="text-xs text-stone-500 mt-2">* Форматування при вставці збережеться.</p>
          </div>

          <!-- Main Image -->
          <div>
            <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Головне фото</label>
            <input type="file" (change)="onFileSelected($event)" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-glow">
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
               @for (src of previews().gallery; track src) {
                  <div class="rounded-xl overflow-hidden border border-white/10 aspect-square relative group">
                    <img [src]="src" class="w-full h-full object-cover">
                  </div>
               }
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-8">
            <button type="submit" [disabled]="isSubmitting" 
                    class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
              @if (isSubmitting) {
                <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Публікація...
              } @else {
                Опублікувати проєкт
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class AdminProjectComponent {
  private data = inject(DataService);
  private router = inject(Router);

  formData = {
    title: '',
    slug: '',
    desc: '',
    details: '', // Stores HTML
    type: 'donor'
  };

  selectedFile: File | null = null;
  galleryFiles: File[] = [];

  // Signals for UI
  isSubmitting = false;
  previews = signal<{ main: string | null, gallery: string[] }>({ main: null, gallery: [] });

  // --- Rich Text Helper ---
  execCommand(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
  }

  onEditorInput(event: Event) {
    const target = event.target as HTMLElement;
    this.formData.details = target.innerHTML;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews.update(p => ({ ...p, main: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  onGallerySelected(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      this.galleryFiles = files;

      // Clear old gallery previews
      this.previews.update(p => ({ ...p, gallery: [] }));

      // Generate new previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.update(p => ({
            ...p,
            gallery: [...p.gallery, e.target.result]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  }

  async onSubmit() {
    if (!this.formData.title || !this.selectedFile) {
      alert('Будь ласка, заповніть назву та додайте головне фото.');
      return;
    }

    this.isSubmitting = true;

    try {
      // 1. Upload Main Image
      const imageUrl = await this.data.uploadFile(this.selectedFile);

      // 2. Upload Gallery
      const galleryUrls: string[] = [];
      for (const file of this.galleryFiles) {
        const uploaded = await this.data.uploadFile(file);
        galleryUrls.push(uploaded);
      }

      // 3. Create Project Document
      await this.data.createProject({
        title: this.formData.title,
        slug: this.formData.slug, // Save SLUG!
        desc: this.formData.desc,
        details: this.formData.details, // Save HTML
        type: this.formData.type,
        image: imageUrl,
        gallery: galleryUrls, // Save Gallery
        date: new Date().toISOString()
      });

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error creating project', error);
      alert('Помилка при створенні проєкту');
    } finally {
      this.isSubmitting = false;
    }
  }
}