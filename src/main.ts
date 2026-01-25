import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes'; // Імпортуємо маршрути

bootstrapApplication(AppComponent, {
  providers: [
    // Підключаємо роутер
    provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Прокручувати вгору при переході
    }))
  ]
}).catch((err) => console.error(err));