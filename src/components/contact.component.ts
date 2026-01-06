import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <section id="contact" class="py-20 bg-slate-900 text-white relative overflow-hidden">
      <!-- Background Abstract Shapes -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-amber-900/30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 right-0 w-64 h-64 bg-orange-900/20 rounded-full blur-3xl"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <!-- Contact Info -->
          <div>
            <h2 class="text-3xl font-bold mb-6">{{ ts.t().contact.title }}</h2>
            <p class="text-slate-300 mb-10 text-lg leading-relaxed">
              {{ ts.t().contact.description }}
            </p>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 mr-4 flex-shrink-0">
                  <span class="material-icons-round">location_on</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white">{{ ts.t().contact.addressTitle }}</h4>
                  <p class="text-slate-400">{{ ts.t().contact.addressValue }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 mr-4 flex-shrink-0">
                  <span class="material-icons-round">email</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white">{{ ts.t().contact.emailTitle }}</h4>
                  <p class="text-slate-400">info@cepa.org.ua</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 mr-4 flex-shrink-0">
                  <span class="material-icons-round">phone</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white">{{ ts.t().contact.phoneTitle }}</h4>
                  <p class="text-slate-400">+380 44 123 45 67</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="bg-white rounded-2xl p-8 text-slate-800 shadow-2xl">
            <h3 class="text-2xl font-bold mb-6 text-slate-900">{{ ts.t().contact.formTitle }}</h3>
            
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4">
              
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700 mb-1">{{ ts.t().contact.form.name }}</label>
                <input 
                  id="name"
                  type="text" 
                  formControlName="name"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-slate-50"
                  [placeholder]="ts.t().contact.form.namePlaceholder"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-1">{{ ts.t().contact.form.email }}</label>
                <input 
                  id="email"
                  type="email" 
                  formControlName="email"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-slate-50"
                  [placeholder]="ts.t().contact.form.emailPlaceholder"
                >
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-slate-700 mb-1">{{ ts.t().contact.form.message }}</label>
                <textarea 
                  id="message"
                  formControlName="message"
                  rows="4"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-slate-50 resize-none"
                  [placeholder]="ts.t().contact.form.messagePlaceholder"
                ></textarea>
              </div>

              <button 
                type="submit" 
                [disabled]="contactForm.invalid || isSubmitting()"
                class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-amber-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                @if (isSubmitting()) {
                  <span class="material-icons-round animate-spin mr-2">refresh</span> {{ ts.t().contact.form.submitting }}
                } @else {
                  {{ ts.t().contact.form.submit }}
                }
              </button>

              @if (showSuccess()) {
                <div class="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                  <span class="material-icons-round mr-2">check_circle</span>
                  {{ ts.t().contact.form.success }}
                </div>
              }
            </form>
          </div>

        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  ts = inject(TranslationService);
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required])
  });

  isSubmitting = signal(false);
  showSuccess = signal(false);

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.showSuccess.set(true);
        this.contactForm.reset();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccess.set(false);
        }, 3000);
      }, 1500);
    }
  }
}