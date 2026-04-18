import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-edit-publication',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark pt-32 pb-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
           <button (click)="goBack()" class="text-stone-400 hover:text-white transition-colors">
             <span class="material-icons-round text-3xl">arrow_back</span>
           </button>
           <h2 class="text-4xl font-serif text-white">Редагувати публікацію</h2>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center items-center py-20">
            <span class="material-icons-round animate-spin text-4xl text-primary">refresh</span>
          </div>
        } @else if (pubItem()) {
          <form (ngSubmit)="onSubmit()" class="glass-panel p-8 rounded-glass border border-white/10 space-y-6">
            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Заголовок публікації</label>
              <input type="text" [(ngModel)]="formData.title" name="title" required
                     class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Категорія</label>
              <select [(ngModel)]="formData.category" name="category"
                      class="w-full bg-stone-800 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none">
                <option value="Аналітичні звіти">Аналітичний звіт</option>
                <option value="Дайджест">Дайджест</option>
              </select>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Короткий опис</label>
              <textarea [(ngModel)]="formData.desc" name="desc" rows="6" required
                        class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none"></textarea>
            </div>

            <div>
              <label class="block text-stone-400 text-sm font-bold mb-2 uppercase tracking-wider">Посилання (Лінк)</label>
              <input type="text" [(ngModel)]="formData.link" name="link"
                     class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors">
            </div>

            <div class="pt-8">
              <button type="submit" [disabled]="isSubmitting"
                      class="w-full py-4 bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
                {{ isSubmitting ? 'Збереження...' : 'Зберегти зміни' }}
              </button>
            </div>
          </form>
        } @else {
          <div class="text-center py-20 text-white">Публікацію не знайдено.</div>
        }
      </div>
    </div>
  `
})
export class AdminEditPublicationComponent implements OnInit {
  private data = inject(DataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(true);
  pubItem = signal<any>(null);

  formData = {
    title: '',
    category: 'Аналітичні звіти',
    desc: '',
    link: ''
  };

  isSubmitting = false;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/publications']);
      return;
    }

    try {
      const pub = await this.data.getPublicationById(id);
      if (pub) {
        this.pubItem.set(pub);
        this.formData = {
          title: pub.title || '',
          category: pub.category || 'Аналітичні звіти',
          desc: pub.desc || '',
          link: pub.link || ''
        };
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/publication', this.pubItem().$id]);
  }

  async onSubmit() {
    if (!this.formData.title) {
      alert('Будь ласка, заповніть назву.');
      return;
    }
    this.isSubmitting = true;
    try {
      const updateData = { ...this.formData };
      await this.data.updatePublication(this.pubItem().$id, updateData);
      alert('Публікацію успішно оновлено!');
      this.goBack();
    } catch (error) {
      console.error('Error updating publication', error);
      alert('Помилка при оновленні публікації');
    } finally {
      this.isSubmitting = false;
    }
  }
}
