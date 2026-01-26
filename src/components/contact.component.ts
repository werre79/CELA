import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../services/translation.service';
import { AppwriteService } from '../services/appwrite.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contact" class="relative py-20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#1a100a] to-[#2E1A12] z-0"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div class="text-white">
            <h2 class="text-4xl font-bold mb-6">{{ ts.t().contact.title }}</h2>
            
            <p class="text-xl text-slate-300 mb-12">{{ ts.t().contact.subtitle }}</p>

            <div class="space-y-8">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#D97736]">
                  <span class="material-icons-round text-2xl">location_on</span>
                </div>
                <div>
                  <h4 class="font-bold text-lg text-white">{{ ts.t().contact.addressTitle }}</h4>
                  <p class="text-slate-400">{{ ts.t().contact.addressValue }}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#D97736]">
                  <span class="material-icons-round text-2xl">email</span>
                </div>
                <div>
                  <h4 class="font-bold text-lg text-white">{{ ts.t().contact.emailTitle }}</h4>
                  <a href="mailto:info&#64;cela.org.ua" class="text-slate-400 hover:text-[#D97736] transition-colors">info&#64;cela.org.ua</a>
                </div>
              </div>

              <div class="pt-8">
                <h4 class="font-bold text-white mb-4">Ми в соцмережах</h4>
                <div class="flex gap-4">
                  <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D97736] transition-all hover:scale-110">
                    <span class="material-icons-round text-white">play_arrow</span>
                  </a>
                  <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D97736] transition-all hover:scale-110">
                    <span class="material-icons-round text-white">facebook</span>
                  </a>
                  <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D97736] transition-all hover:scale-110">
                    <span class="material-icons-round text-white">work</span>
                  </a>
                  <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D97736] transition-all hover:scale-110">
                    <span class="material-icons-round text-white">photo_camera</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-8 rounded-3xl shadow-lg">
            <h3 class="text-2xl font-bold text-brand-dark mb-2">{{ ts.t().contact.formTitle }}</h3>
            <p class="text-slate-500 mb-6">Заповніть форму, і наші експерти зв'яжуться з вами.</p>

            <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
              
              <div class="mb-4">
                <input type="text" name="name" [(ngModel)]="formData.name" required
                       class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#D97736] focus:ring-2 focus:ring-[#D97736]/20 outline-none transition-all"
                       [placeholder]="ts.t().contact.form.namePlaceholder">
              </div>

              <div class="mb-4">
                <input type="email" name="email" [(ngModel)]="formData.email" required email
                       class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#D97736] focus:ring-2 focus:ring-[#D97736]/20 outline-none transition-all"
                       [placeholder]="ts.t().contact.form.emailPlaceholder">
              </div>

              <div class="mb-6">
                <textarea name="message" [(ngModel)]="formData.message" required rows="4"
                          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#D97736] focus:ring-2 focus:ring-[#D97736]/20 outline-none transition-all resize-none"
                          [placeholder]="ts.t().contact.form.messagePlaceholder"></textarea>
              </div>

              <button type="submit" 
                      class="w-full py-4 bg-[#D97736] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(217,119,54,0.6)] hover:shadow-[0_0_30px_rgba(217,119,54,0.9)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center"
                      [disabled]="!contactForm.form.valid || isSubmitting()">
                
                @if (isSubmitting()) {
                  <span class="material-icons-round animate-spin mr-2">refresh</span> {{ ts.t().contact.form.submitting }}
                } @else if (isSuccess()) {
                  <span class="material-icons-round mr-2">check_circle</span> {{ ts.t().contact.form.success }}
                } @else {
                  {{ ts.t().contact.form.submit }}
                }
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  ts = inject(TranslationService);
  appwrite = inject(AppwriteService);

  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = signal(false);
  isSuccess = signal(false);

  async onSubmit() {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    
    try {
      // Імітація відправки (або розкоментуйте appwrite.submitContactForm)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.isSuccess.set(true);
      this.formData = { name: '', email: '', message: '' };
      
      setTimeout(() => {
        this.isSuccess.set(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form', error);
      alert('Помилка при відправці.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}