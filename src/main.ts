import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }))
  ]
}).catch((err) => console.error(err));