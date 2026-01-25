import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'absolute w-full ' + getPositionClass() + ' ' + className">
      <div 
        [class]="'absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[512px] ' + (variant === 'center' ? '-translate-y-1/2' : '')">
      </div>
      
      <div 
        [class]="'absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.4)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[256px] ' + (variant === 'center' ? '-translate-y-1/2' : '')">
      </div>
    </div>
  `
})
export class GlowComponent {
  @Input() variant: 'top' | 'above' | 'bottom' | 'below' | 'center' = 'top';
  @Input() className: string = '';

  getPositionClass(): string {
    switch (this.variant) {
      case 'top': return 'top-0';
      case 'above': return '-top-[128px]';
      case 'bottom': return 'bottom-0';
      case 'below': return '-bottom-[128px]';
      case 'center': return 'top-[50%]';
      default: return 'top-0';
    }
  }
}