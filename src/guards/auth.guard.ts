import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { DataService } from '../services/data.service';

export const authGuard: CanActivateFn = async () => {
  const dataService = inject(DataService);
  const router = inject(Router);

  try {
    const user = await dataService.getCurrentUser();
    if (user) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch {
    router.navigate(['/login']);
    return false;
  }
};