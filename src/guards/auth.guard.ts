import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { DataService } from '../services/data.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const dataService = inject(DataService);
  const router = inject(Router);

  const user = await dataService.getCurrentUser();
  if (user) {
    return true;
  }

  // Remember where the user was heading so login can send them back.
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
