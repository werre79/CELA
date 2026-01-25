import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { CommonModule } from '@angular/common';

interface MemberDisplay {
  name: string;
  role: string;
  image: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="team" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ ts.t().team.title }}</h2>
          <div class="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p class="mt-4 text-lg text-slate-600">{{ ts.t().team.subtitle }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <div *ngFor="let member of membersDisplay()" class="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
            <div class="h-64 overflow-hidden relative group bg-slate-200">
               <div class="absolute inset-0 flex items-center justify-center text-slate-400">
                 <span class="material-icons-round text-6xl">person</span>
               </div>
               <img [src]="member.image" [alt]="member.name" class="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105">
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-slate-900">{{ member.name }}</h3>
              <p class="text-amber-700 font-medium mb-4">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {
  ts = inject(TranslationService);

  private memberImages = [
    'https://picsum.photos/400/500?random=1',
    'https://picsum.photos/400/500?random=2',
    'https://picsum.photos/400/500?random=3'
  ];

  membersDisplay = computed<MemberDisplay[]>(() => {
    const texts = this.ts.t().team.members;
    // Виправлення типів тут
    return texts.map((text: any, index: number) => ({
      name: text.name,
      role: text.role,
      image: this.memberImages[index] || ''
    }));
  });
}