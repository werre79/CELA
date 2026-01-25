import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-neu-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [class]="'neu-btn ' + className" (click)="onClick()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .neu-btn {
      /* НАЛАШТУВАННЯ КОЛЬОРІВ (Помаранчевий бренд) */
      --btn-bg: #D97736;         /* Основний колір (Brand Orange) */
      --shadow-light: #fba564;   /* Світла тінь (блік) */
      --shadow-dark: #b85e26;    /* Темна тінь */
      --text-color: #ffffff;
      
      color: var(--text-color);
      padding: 0.7em 1.7em;
      font-size: 18px;
      font-family: inherit;
      font-weight: 600;
      border-radius: 18px; /* Squircle */
      background: var(--btn-bg);
      cursor: pointer;
      border: none;
      outline: none;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      
      /* Ефект об'єму (Neumorphism) */
      box-shadow: 
        6px 6px 12px var(--shadow-dark), 
        -6px -6px 12px var(--shadow-light);
    }

    /* Ефект натискання (Втиснута кнопка) */
    .neu-btn:active {
      color: #ffe0c2;
      /* Внутрішня тінь створює ефект впадини */
      box-shadow: 
        inset 4px 4px 12px var(--shadow-dark), 
        inset -4px -4px 12px var(--shadow-light);
      transform: scale(0.98);
    }
    
    .neu-btn:hover {
       transform: translateY(-2px);
    }
  `]
})
export class NeuButtonComponent {
  @Input() className: string = '';
  
  onClick() {
    // Емітуємо подію кліку (стандартна поведінка)
  }
}