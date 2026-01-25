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
            <p class="text-xl text-slate-300 mb-12">{{ ts.t().contact.description }}</p>

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
                <input 
                  type="text" 
                  [(ngModel)]="formData.name" 
                  name="name"
                  required
                  [placeholder]="ts.t().contact.form.namePlaceholder"
                  class="
                    w-full px-4 py-3 rounded-xl border border-slate-200 
                    bg-white text-slate-800 placeholder:text-slate-400 
                    focus:border-[#D97736] focus:ring-2 focus:ring-[#D97736]/20 
                    outline-none transition-all
                  "
                  [disabled]="isSubmitting()"
                >
              </div>

              <div class="mb-4">
                <input 
                  type="email" 
                  [(ngModel)]="formData.email" 
                  name="email"
                  required
                  [placeholder]="ts.t().contact.form.emailPlaceholder"
                  class="
                    w-full px-4 py-3 rounded-xl border border-slate-200 
                    bg-white text-slate-800 placeholder:text-slate-400 
                    focus:border-[#D97736] focus:ring-2 focus:ring-[#D97736]/20 
                    outline-none transition-all
                  "
                  [disabled]="isSubmitting()"
                >
              </div>

              <div class="mb-6">
                <textarea 
                  [(ngModel)]="formData.message" 
                  name="message"
                  required
                  rows="4"
                  [placeholder]="ts.t().contact.form.messagePlaceholder"
                  class="
                    w-full px-4 py-3 rounded-xl border border-slate-200 
                    bg-white text-slate-800 placeholder:text-slate-400 
                    focus:border-[#D97736] focus:ring-2 focus:ring-[#D97736]/20 
                    outline-none transition-all resize-none
                  "
                  [disabled]="isSubmitting()"
                ></textarea>
              </div>

              <button 
                type="submit" 
                [disabled]="isSubmitting() || !contactForm.form.valid"
                class="
                  w-full py-4 
                  bg-[#D97736] text-white font-bold text-lg rounded-xl 
                  transition-all duration-300
                  shadow-[0_0_20px_rgba(217,119,54,0.6)]
                  hover:shadow-[0_0_30px_rgba(217,119,54,0.9)] hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  flex justify-center items-center
                "
              >
                @if (isSubmitting()) {
                  <span class="material-icons-round animate-spin mr-2">refresh</span>
                  Відправка...
                } @else {
                  {{ ts.t().contact.form.submit }}
                }
              </button>

              @if (status() === 'success') {
                <div class="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                  ✅ {{ ts.t().contact.form.success }}
                </div>
              }
              @if (status() === 'error') {
                <div class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
                  ❌ Сталася помилка. Спробуйте пізніше.
                </div>
              }
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
  status = signal<'idle' | 'success' | 'error'>('idle');

  async onSubmit() {
    // 1. Перевірка: чи заповнені поля?
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;

    // 2. Вмикаємо "Завантаження..."
    this.isSubmitting.set(true);
    this.status.set('idle');

    try {
      // 3. Пробуємо відправити в Appwrite
      await this.appwrite.sendRequest(this.formData);
      
      // 4. Якщо успішно:
      this.status.set('success');
      this.formData = { name: '', email: '', message: '' }; // Очищаємо поля
      
      // Прибираємо повідомлення про успіх через 5 секунд
      setTimeout(() => this.status.set('idle'), 5000);

    } catch (err) {
      // 5. Якщо сталася помилка (ОСЬ ВАШ ШМАТОК КОДУ):
      console.error('Contact form submit error', err);
      this.status.set('error');
      
    } finally {
      this.isSubmitting.set(false);
    }
  }
}