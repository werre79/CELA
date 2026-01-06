import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TranslationService } from '../services/translation.service';

interface MemberDisplay {
  name: string;
  role: string;
  image: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  template: `
    <section id="team" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ ts.t().team.title }}</h2>
          <div class="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p class="mt-4 text-lg text-slate-600">{{ ts.t().team.subtitle }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          @for (member of membersDisplay(); track member.name) {
            <div class="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
              <div class="h-64 overflow-hidden relative group">
                <!-- Overlay with color tint on hover -->
                <div class="absolute inset-0 bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img [src]="member.image" [alt]="member.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900">{{ member.name }}</h3>
                <p class="text-amber-700 font-medium mb-4">{{ member.role }}</p>
                <div class="flex space-x-3 opacity-60">
                   <!-- Fake social icons for design consistency -->
                   <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-amber-100 hover:text-amber-600 transition-colors cursor-pointer">
                     <span class="text-xs font-bold">in</span>
                   </div>
                   <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-amber-100 hover:text-amber-600 transition-colors cursor-pointer">
                     <span class="text-xs font-bold">tw</span>
                   </div>
                </div>
              </div>
            </div>
          }
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
    return texts.map((text, index) => ({
      name: text.name,
      role: text.role,
      image: this.memberImages[index]
    }));
  });
}