import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark pt-32 pb-20 px-4">
      
      @if (isLoadingUser) {
        <div class="flex justify-center items-center h-64">
           <span class="material-icons-round animate-spin text-4xl text-brand-amber">refresh</span>
           <span class="ml-3 text-brand-cream font-medium">Перевірка доступу...</span>
        </div>
      } 
      @else {
        <div class="max-w-2xl mx-auto bg-brand-charcoal border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold text-brand-cream">Додати члена команди</h2>
            <button type="button" (click)="router.navigate(['/admin/add'])" class="text-brand-stone hover:text-white text-sm">
              <span class="material-icons-round align-middle text-sm mr-1">arrow_back</span>
              До проєктів
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" #f="ngForm" class="space-y-6">
            
            <div>
              <label class="block text-brand-stone mb-2 text-sm font-bold">Ім'я та Прізвище</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-amber focus:outline-none transition-colors">
            </div>

            <div>
              <label class="block text-brand-stone mb-2 text-sm font-bold">Посада</label>
              <input type="text" [(ngModel)]="formData.role" name="role" required
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-amber focus:outline-none transition-colors">
            </div>

            <div>
              <label class="block text-brand-stone mb-2 text-sm font-bold">LinkedIn (посилання)</label>
              <input type="url" [(ngModel)]="formData.linkedin" name="linkedin"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-amber focus:outline-none transition-colors">
            </div>

            <div>
              <label class="block text-brand-stone mb-2 text-sm font-bold">Фото</label>
              <div class="relative w-32 h-32 border-2 border-dashed border-white/10 rounded-full hover:border-brand-amber/50 transition-colors flex flex-col items-center justify-center cursor-pointer bg-black/10 overflow-hidden mx-auto group">
                <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-20">
                
                @if (previewUrl) {
                  <img [src]="previewUrl" class="absolute inset-0 w-full h-full object-cover z-10">
                  <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                     <span class="material-icons-round text-white">edit</span>
                  </div>
                } @else {
                  <span class="material-icons-round text-2xl text-brand-stone">add_a_photo</span>
                }
              </div>
            </div>

            <button type="submit" [disabled]="isSubmitting || !f.valid"
              class="w-full py-4 bg-brand-amber text-white font-bold rounded-xl shadow-lg hover:bg-[#b56028] transition-all disabled:opacity-50 mt-4">
              {{ isSubmitting ? 'Збереження...' : 'Додати в команду' }}
            </button>

          </form>
        </div>
      }
    </div>
  `
})
export class AdminTeamComponent implements OnInit {
  private data = inject(DataService);
  router = inject(Router);

  isLoadingUser = true;

  formData = {
    name: '',
    role: '',
    linkedin: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;

  async ngOnInit() {
    try {
      const user = await this.data.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
      }
    } catch {
      this.router.navigate(['/login']);
    } finally {
      this.isLoadingUser = false;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit() {
    if (!this.selectedFile) {
      alert('Будь ласка, оберіть фото!');
      return;
    }
    this.isSubmitting = true;

    try {
      const imageUrl = await this.data.uploadFile(this.selectedFile);

      await this.data.addTeamMember({
        name: this.formData.name,
        role: this.formData.role,
        linkedin: this.formData.linkedin,
        image: imageUrl
      });

      alert('Успішно додано!');
      this.formData = { name: '', role: '', linkedin: '' };
      this.selectedFile = null;
      this.previewUrl = null;

    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('permissions')) {
        alert('Помилка доступу! Залогіньтесь знову.');
        this.router.navigate(['/login']);
      } else {
        alert('Помилка при збереженні');
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}