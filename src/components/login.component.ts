import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-brand-charcoal border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <h2 class="text-3xl font-bold text-brand-cream mb-6 text-center">Вхід для працівників</h2>

        <form (ngSubmit)="onLogin()" class="space-y-6">
          <div>
            <label class="block text-brand-stone mb-2 text-sm font-bold">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-amber focus:outline-none">
          </div>

          <div>
            <label class="block text-brand-stone mb-2 text-sm font-bold">Пароль</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-amber focus:outline-none">
          </div>

          <button type="submit" [disabled]="isLoading || successMsg !== ''"
            class="w-full py-4 bg-brand-amber text-white font-bold rounded-xl shadow-lg hover:bg-[#b56028] transition-all disabled:opacity-50">
            {{ isLoading ? 'Вхід...' : 'Увійти' }}
          </button>

          @if (errorMsg) {
            <p class="text-red-400 text-center text-sm bg-red-400/10 p-2 rounded-lg border border-red-400/20">{{ errorMsg }}</p>
          }
          @if (successMsg) {
            <p class="text-green-400 text-center text-sm bg-green-400/10 p-2 rounded-lg border border-green-400/20">{{ successMsg }}</p>
          }
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private data = inject(DataService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  async ngOnInit() {
    const user = await this.data.getCurrentUser();
    if (user) {
      this.router.navigate(['/admin/add']);
    }
  }

  async onLogin() {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    try {
      await this.data.login(this.email, this.password);
      this.successMsg = 'Успішний вхід! Перенаправлення...';

      // small delay to show the success message
      setTimeout(() => {
        this.router.navigate(['/admin/add']);
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);

      const errMsg = error?.message?.toLowerCase() || '';

      if (error?.type === 'user_session_already_exists' || error?.code === 401 && errMsg.includes('session is active')) {
         this.router.navigate(['/admin/add']);
      } else if (errMsg.includes('network') || errMsg.includes('fetch failed') || errMsg.includes('failed to fetch')) {
        this.errorMsg = 'Немає зв\'язку із сервером (Network Error). Перевірте підключення до Інтернету або налаштування Appwrite.';
      } else if (error?.code === 401 || errMsg.includes('invalid credentials')) {
        this.errorMsg = 'Невірний логін або пароль.';
      } else if (error?.code === 429 || errMsg.includes('rate limit')) {
        this.errorMsg = 'Забагато спроб входу. Зачекайте та спробуйте пізніше.';
      } else if (error?.code === 400 || errMsg.includes('invalid email')) {
        this.errorMsg = 'Некоректна email адреса або пароль.';
      } else {
        // Fallback to show the actual error message from the server if possible
        this.errorMsg = error?.message ? `Помилка: ${error.message}` : 'Невідома помилка під час входу.';
      }
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}