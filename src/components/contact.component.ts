import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact" class="relative py-20 overflow-hidden">
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <!-- Left: Contact Info -->
          <div class="text-white pt-10">
            <h2 class="text-5xl font-serif font-bold mb-6 drop-shadow-2xl">{{ ts.t().contact.title }}</h2>
            <p class="text-xl text-stone-200 mb-12 font-light max-w-md leading-relaxed">{{ ts.t().contact.subtitle }}</p>

            <div class="space-y-10">
              <div class="flex items-start gap-6 group">
                <div class="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-accent-glow group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg">
                  <span class="material-icons-round text-2xl">location_on</span>
                </div>
                <div>
                  <h4 class="font-serif font-bold text-xl text-white mb-1">{{ ts.t().contact.addressTitle }}</h4>
                  <p class="text-stone-300 font-light">{{ ts.t().contact.addressValue }}</p>
                </div>
              </div>

              <div class="flex items-start gap-6 group">
                <div class="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-accent-glow group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg">
                  <span class="material-icons-round text-2xl">email</span>
                </div>
                <div>
                  <h4 class="font-serif font-bold text-xl text-white mb-1">{{ ts.t().contact.emailTitle }}</h4>
                  <a href="mailto:cepa.org&#64;gmail.com" class="text-stone-300 hover:text-accent-glow transition-colors font-light">info&#64;cela.org.ua</a>
                </div>
              </div>

            </div>
          </div>

          <!-- Right: Google Form CTA -->
          <div class="glass-panel p-10 rounded-2xl shadow-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center gap-8">
            <span class="material-icons-round text-6xl text-accent/60">forum</span>
            <div>
              <h3 class="text-3xl font-serif font-bold text-white mb-3">{{ ts.t().contact.formTitle }}</h3>
              <p class="text-stone-400 font-light leading-relaxed max-w-sm mx-auto">
                {{ ts.t().contact.subtitle }}
              </p>
            </div>
            <a href="https://forms.gle/REPLACE_WITH_REAL_FORM"
               target="_blank"
               rel="noopener noreferrer"
               class="w-full py-5 bg-accent hover:bg-accent-glow text-white font-bold text-base rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(217,119,54,0.4)] hover:shadow-[0_0_40px_rgba(217,119,54,0.6)] hover:-translate-y-1 flex justify-center items-center uppercase tracking-wider gap-3">
              {{ ts.t().contact.form.submit }}
              <span class="material-icons-round">open_in_new</span>
            </a>
            <p class="text-stone-600 text-xs">Google Forms · Безпечно та конфіденційно</p>
          </div>

        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  ts = inject(TranslationService);
}