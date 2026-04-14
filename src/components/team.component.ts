import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="team" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center mb-20">
          <h2 class="font-serif font-bold text-4xl text-white mb-6">{{ ts.t().team.title }}</h2>
          <p class="font-sans text-lg text-stone-300 max-w-2xl mx-auto font-light">{{ ts.t().team.subtitle }}</p>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center items-center py-20">
            <span class="material-icons-round animate-spin text-4xl text-white/50">refresh</span>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 justify-items-center">
          @for (member of members(); track member.$id) {
            <div class="group w-full max-w-sm rounded-2xl p-6 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10">
              
              <!-- Image -->
              <div class="aspect-[4/5] overflow-hidden mb-6 rounded-2xl bg-white/5 relative border border-white/10">
                 @if (member.image) {
                   <img [src]="member.image" [alt]="member.name" class="w-full h-full object-cover">
                 } @else {
                   <div class="w-full h-full flex items-center justify-center text-white/20">
                      <span class="material-icons-round text-4xl">person</span>
                   </div>
                 }
              </div>

              <!-- Content -->
              <div class="text-center">
                <h3 class="font-serif font-bold text-2xl text-white mb-2">{{ member.name }}</h3>
                <p class="font-sans text-sm font-bold uppercase tracking-wider text-stone-400">{{ member.role }}</p>
                @if (member.linkedin) {
                  <a [href]="member.linkedin" target="_blank" class="inline-block mt-3 text-stone-500 hover:text-white transition-colors">
                    <span class="material-icons-round text-xl">link</span>
                  </a>
                }
              </div>
            </div>
          }
        </div>

        @if (!members().length && !isLoading()) {
          <div class="text-center py-20 px-6 rounded-2xl border border-dashed border-white/20 bg-white/5 max-w-2xl mx-auto flex flex-col items-center">
            <svg class="w-24 h-24 text-white/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="text-xl font-serif text-white/80 mb-2">{{ ts.t().team.title }}</h3>
            <p class="font-sans text-stone-400">{{ ts.t().team.empty }}</p>
          </div>
        }
      </div>
    </section>
  `,
  // Removing OnPush because we use signal which supports it but Angular 17/18 might complain if zone drops out, though signals are fine. Kept OnPush for performance.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent implements OnInit {
  ts = inject(TranslationService);
  data = inject(DataService);

  isLoading = signal(true);
  members = signal<any[]>([]);

  async ngOnInit() {
    try {
      const data = await this.data.getTeam();
      this.members.set(data);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}