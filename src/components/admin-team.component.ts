import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
        <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          
          <!-- FORM SECTION -->
          <div class="bg-brand-charcoal border border-white/10 rounded-2xl p-8 shadow-2xl self-start">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-2xl font-bold text-brand-cream">{{ editingMemberId ? 'Редагувати' : 'Додати' }} члена команди</h2>
              <div class="flex gap-2">
                @if (editingMemberId) {
                   <button type="button" (click)="cancelEdit()" class="text-brand-stone hover:text-white text-sm">
                     Скасувати
                   </button>
                }
                <button type="button" (click)="router.navigate(['/admin/add'])" class="text-brand-stone hover:text-white text-sm">
                  <span class="material-icons-round align-middle text-sm mr-1">arrow_back</span>
                  До проєктів
                </button>
              </div>
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
                {{ isSubmitting ? 'Збереження...' : (editingMemberId ? 'Зберегти зміни' : 'Додати в команду') }}
              </button>
            </form>
          </div>

          <!-- LIST SECTION -->
          <div class="bg-brand-charcoal border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 class="text-2xl font-bold text-brand-cream mb-6">Існуючі члени команди</h2>

            <div class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              @if (teamMembers.length === 0) {
                <p class="text-stone-400 text-sm">Команда порожня.</p>
              }

              @for (member of teamMembers; track member.$id) {
                <div class="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                   <img [src]="member.image" class="w-12 h-12 rounded-full object-cover border border-white/10">
                   <div class="flex-1 min-w-0">
                      <h4 class="text-white font-bold truncate">{{ member.name }}</h4>
                      <p class="text-xs text-stone-400 truncate">{{ member.role }}</p>
                   </div>
                   <div class="flex gap-2">
                      <button (click)="editMember(member)" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center transition-colors">
                        <span class="material-icons-round text-sm">edit</span>
                      </button>
                      <button (click)="deleteMember(member.$id)" class="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors">
                        <span class="material-icons-round text-sm">delete</span>
                      </button>
                   </div>
                </div>
              }
            </div>
          </div>

        </div>
      }
    </div>
  `
})
export class AdminTeamComponent implements OnInit {
  private data = inject(DataService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isLoadingUser = true;

  formData = {
    name: '',
    role: '',
    linkedin: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;
  teamMembers: any[] = [];
  editingMemberId: string | null = null;

  async ngOnInit() {
    try {
      const user = await this.data.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        this.isLoadingUser = false;
        return;
      }
      await this.loadTeam();
    } catch (e) {
      console.error('Error in AdminTeamComponent ngOnInit:', e);
      this.router.navigate(['/login']);
    } finally {
      // Angular change detection might not trigger properly if this isn't executed.
      this.isLoadingUser = false;
      this.cdr.detectChanges();
    }
  }

  async loadTeam() {
    this.teamMembers = await this.data.getTeam();
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

  editMember(member: any) {
    this.editingMemberId = member.$id;
    this.formData = {
      name: member.name || '',
      role: member.role || '',
      linkedin: member.linkedin || ''
    };
    this.previewUrl = member.image || null;
    this.selectedFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingMemberId = null;
    this.formData = { name: '', role: '', linkedin: '' };
    this.previewUrl = null;
    this.selectedFile = null;
  }

  async deleteMember(id: string) {
    if (confirm('Ви впевнені, що хочете видалити цього члена команди?')) {
      try {
        await this.data.deleteTeamMember(id);
        await this.loadTeam();
      } catch (error) {
        console.error(error);
        alert('Помилка при видаленні');
      }
    }
  }

  async onSubmit() {
    if (!this.editingMemberId && !this.selectedFile) {
      alert('Будь ласка, оберіть фото!');
      return;
    }
    this.isSubmitting = true;

    try {
      let imageUrl = this.previewUrl;
      if (this.selectedFile) {
        imageUrl = await this.data.uploadFile(this.selectedFile);
      }

      if (this.editingMemberId) {
        await this.data.updateTeamMember(this.editingMemberId, {
          name: this.formData.name,
          role: this.formData.role,
          linkedin: this.formData.linkedin,
          ...(this.selectedFile && { image: imageUrl })
        });
        alert('Успішно оновлено!');
      } else {
        await this.data.addTeamMember({
          name: this.formData.name,
          role: this.formData.role,
          linkedin: this.formData.linkedin,
          image: imageUrl
        });
        alert('Успішно додано!');
      }

      this.cancelEdit();
      await this.loadTeam();

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