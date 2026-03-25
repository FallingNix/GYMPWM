import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const ptGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isPT() || authService.isAdmin()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};