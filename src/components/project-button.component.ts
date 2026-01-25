import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="link" 
       class="
         group relative 
         /* 1. ФОН КНОПКИ (Ваш помаранчевий) */
         bg-[#D97736] 
         text-white 
         font-medium text-[17px] 
         px-4 py-[0.35em] pl-5 h-[2.8em] 
         rounded-[0.9em] 
         flex items-center 
         overflow-hidden cursor-pointer 
         /* Тінь всередині для об'єму (темно-коричнева) */
         shadow-[inset_0_0_1.6em_-0.6em_#2E1A12] 
         transition-all duration-300
         hover:shadow-[inset_0_0_1.6em_-0.6em_#2E1A12,0_10px_20px_-5px_rgba(217,119,54,0.4)]
         w-fit
       ">
      
      <span class="mr-10 relative z-10 transition-colors duration-300 group-hover:text-[#2E1A12] font-bold">
        <ng-content></ng-content>
      </span>

      <div class="
        absolute right-[0.3em] 
        bg-white 
        h-[2.2em] w-[2.2em] 
        rounded-[0.7em] 
        flex items-center justify-center 
        transition-all duration-300 
        group-hover:w-[calc(100%-0.6em)] 
        shadow-[0.1em_0.1em_0.6em_0.2em_rgba(0,0,0,0.1)] 
        active:scale-95
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" 
             class="w-[1.1em] transition-transform duration-300 text-[#D97736] group-hover:translate-x-[0.1em]">
          <path fill="none" d="M0 0h24v24H0z" />
          <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
        </svg>
      </div>
    </a>
  `
})
export class ProjectButtonComponent {
  @Input() link: any[] | string = [];
}