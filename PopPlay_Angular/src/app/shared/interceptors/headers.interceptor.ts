import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authServ = inject(AuthService);
  const token = authServ.getToken();
  
  if (token != null) {
    const accessToken = token.access
    const refreshToken = token.refresh
    console.log(accessToken, jwtDecode(accessToken))
    const tokenExpirationDate: number = jwtDecode(accessToken).exp! * 1000;

    // TODO: implement refresh token
    if (Date.now() >= tokenExpirationDate) {
      authServ.removeToken();
      router.navigate(['']);
      alert("Votre session à expiré. Veuillez vous reconnecter.")
    } else {
      let clone = req.clone({
        setHeaders: {
          authorization: 'Bearer ' + accessToken,
        },
      });
      return next(clone);
    }
  }
  
  return next(req);
};
