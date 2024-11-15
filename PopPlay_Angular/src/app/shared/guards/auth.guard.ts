import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/api/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authServ = inject(AuthService);
  const router = inject(Router);
  
  if (!authServ.isConnected()) {
    router.navigate(['accounts/login']);
    return false
  }
  
  return true;
};
