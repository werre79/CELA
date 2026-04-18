import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-edit-news',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark pt-32 pb-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
           <button (click)="goBack()" class="text-stone-400 hover:text-white transition-colors">
             <span class="material-icons-round text-3xl">arrow_back</span>
           </button>
           <h2 class="text-4xl font-serif text-white">Редагувати новину</h2>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center items-center py-20">
            <span class="material-icons-round animate-spin text-4xl text-primary">refresh</span>
          </div>
        } @else if (newsItem()) {
          <form (ngSubmit)="onSubmit()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Заголовок новини</label>
              <input type="text" [(ngModel)]="formData.title" name="title" required
                     class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Дата</label>
              <input type="date" [(ngModel)]="formData.date" name="date" required
                     class="w-full bg-stone-800 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none">
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Опис / Текст новини</label>
              <textarea [(ngModel)]="formData.desc" name="desc" rows="6" required
                        class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"></textarea>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Фото новини (залиште пустим, щоб не змінювати)</label>
              <input type="file" (change)="onFileSelected($event)" class="w-full text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-glow">
              @if (previewUrl) {
                 <div class="mt-4 rounded-xl overflow-hidden border border-white/10 w-48 aspect-video relative group">
                    <img [src]="previewUrl" class="w-full h-full object-cover">
                 </div>
              } @else if (newsItem()?.image) {
                  <div class="mt-4 rounded-xl overflow-hidden border border-white/10 w-48 aspect-video relative group">
                    <img [src]="newsItem().image" class="w-full h-full object-cover">
                 </div>
              }
            </div>

            <div class="pt-8">
              <button type="submit" [disabled]="isSubmitting"
                      class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
                {{ isSubmitting ? 'Збереження...' : 'Зберегти зміни' }}
              </button>
            </div>
          </form>
        } @else {
          <div class="text-center py-20 text-white">Новину не знайдено.</div>
        }
      </div>
    </div>
  `
})
export class AdminEditNewsComponent implements OnInit {
  private data = inject(DataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(true);
  newsItem = signal<any>(null);

  formData = {
    title: '',
    desc: '',
    date: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/publications']);
      this.isLoading.set(false);
      return;
    }

    try {
      const news = await this.data.getNewsById(id);
      if (news) {
        this.newsItem.set(news);
        this.formData = {
          title: news.title || '',
          desc: news.desc || '',
          date: (news.date || news.createdAt || new Date().toISOString()).split('T')[0]
        };
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    const news = this.newsItem();
    if (!news || !news.$id) {
      this.router.navigate(['/publications']);
      return;
    }

    this.router.navigate(['/news', news.$id]);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
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
        desc: this.formData.desc,
        date: new Date(this.formData.date).toISOString()
      };

      if (this.selectedFile) {
        updateData.image = await this.data.uploadFile(this.selectedFile);
      }

      await this.data.updateNews(this.newsItem().$id, updateData);
      alert('Новину успішно оновлено!');
      this.goBack();
    } catch (error) {
      console.error('Error updating news', error);
      alert('Помилка при оновленні новини');
    } finally {
      this.isSubmitting = false;
    }
  }
}
