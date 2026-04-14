import { Component, inject } from '@angular/core';
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

          <button type="submit" [disabled]="isLoading"
            class="w-full py-4 bg-brand-amber text-white font-bold rounded-xl shadow-lg hover:bg-[#b56028] transition-all disabled:opacity-50">
            {{ isLoading ? 'Вхід...' : 'Увійти' }}
          </button>

          @if (errorMsg) {
            <p class="text-red-400 text-center text-sm bg-red-400/10 p-2 rounded-lg border border-red-400/20">{{ errorMsg }}</p>
          }
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private data = inject(DataService);
  router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  errorMsg = '';

  async onLogin() {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    this.errorMsg = '';

    try {
      await this.data.login(this.email, this.password);
      this.router.navigate(['/admin/add']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMsg = 'Invalid credentials. Try again.';
    } finally {
      this.isLoading = false;
    }
  }
}