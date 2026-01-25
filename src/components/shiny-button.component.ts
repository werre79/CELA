import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shiny-button',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <button [class]="'shiny-cta ' + className">
      <div class="gradient-border"></div>
      
      <div class="inner-bg"></div>
      
      <span class="content"><ng-content></ng-content></span>
    </button>
  `,
  styles: [`
    @property --gradient-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    .shiny-cta {
      --shiny-cta-bg: #2E1A12;
      --shiny-cta-highlight: hsl(24 66% 53%); /* Orange */
      --shiny-cta-highlight-subtle: hsl(45 86% 62%); /* Yellow */
      
      position: relative;
      isolation: isolate;
      overflow: visible; /* Дозволяємо тіні виходити за межі */
      border: none;
      outline: none;
      background: transparent;
      
      /* ЗМІНА 1: Зменшені відступи (було 1rem 2.5rem) */
      padding: 0.8rem 2rem;
      
      border-radius: 18px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.95rem; /* Трохи менший шрифт */
      font-weight: 600;
      color: white;
      
      /* Плавність для левітації */
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* Ефект ЛЕВІТАЦІЇ та СВІТІННЯ знизу при наведенні */
    .shiny-cta:hover {
      transform: translateY(-4px); /* Піднімаємо кнопку вгору */
      /* Тінь знизу (світіння) */
      box-shadow: 0 10px 20px -5px rgba(217, 119, 54, 0.6); 
    }
    
    .shiny-cta:active {
      transform: translateY(-1px); /* При кліку трохи опускаємо */
      box-shadow: 0 5px 10px -5px rgba(217, 119, 54, 0.4);
    }

    /* Рамка градієнта */
    .gradient-border {
      position: absolute;
      inset: -2px; /* Товщина рамки (зовнішня) */
      border-radius: 20px; /* Радіус кнопки + товщина */
      background: conic-gradient(
        from var(--gradient-angle),
        transparent 20%,
        var(--shiny-cta-highlight),
        var(--shiny-cta-highlight-subtle),
        var(--shiny-cta-highlight),
        transparent 80%
      );
      z-index: 0;
      animation: rotate-gradient 3s linear infinite;
      /* Приховуємо рамку, якщо вона виходить за межі заокруглення */
      -webkit-mask: 
         linear-gradient(#fff 0 0) content-box, 
         linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude; 
    }

    /* Внутрішній фон */
    .inner-bg {
      position: absolute;
      inset: 0;
      background: var(--shiny-cta-bg);
      border-radius: 18px;
      z-index: 1;
    }

    .content {
      position: relative;
      z-index: 2;
    }

    @keyframes rotate-gradient {
      0% { --gradient-angle: 0deg; }
      100% { --gradient-angle: 360deg; }
    }
  `]
})
export class ShinyButtonComponent {
  @Input() className: string = '';
}