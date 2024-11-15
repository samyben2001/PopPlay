import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { catchError, throwError } from 'rxjs';

// export const headersInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
//   const router = inject(Router);
//   const authServ = inject(AuthService);
//   const accountServ = inject(AccountService);
//   const token = authServ.getToken();
//   console.log(req.url)

//   if (token) { // check if token exists
//     const accessToken = token.access
//     const refreshToken = token.refresh
//     // console.log(jwtDecode(accessToken))
//     const tokenExpirationDate: number = jwtDecode(accessToken).exp! * 1000;
//     const refreshTokenExpirationDate = jwtDecode(refreshToken).exp! * 1000;

//     if (Date.now() >= tokenExpirationDate) { // check if token is expired
//       console.log("token expired", "check for refresh token")
//       if (Date.now() <= refreshTokenExpirationDate) { // check if refresh token is not expired

//         console.log("refresh token not expired")
//         // FIXME: multiple calls on refresh token => fixed in 'headersInterceptor' function below
//         authServ.refreshToken(refreshToken).subscribe({ // get new token from refresh token
//           next: (token) => {
//             console.log("token is refreshed")
//             authServ.setToken(token);

//             let clone = req.clone({
//               setHeaders: {
//                 authorization: 'Bearer ' + token.access,
//               }
//             });
//             return next(clone);
//           }
//         })
//       } else { // refresh token is expired => logout
//         console.log("refresh token expired")
//         authServ.removeToken();
//         accountServ.account.set(null);
//         router.navigate(['accounts/login']);
//         alert("Votre session à expiré. Veuillez vous reconnecter.")
//       }
//     } else { // token is not expired 
//       console.log("token not expired")
//       let clone = req.clone({
//         setHeaders: {
//           authorization: 'Bearer ' + accessToken,
//         },
//       });
//       return next(clone);
//     }
//   }
//   console.log("no token")
//   return next(req);
// };

export const headersInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const authServ = inject(AuthService);
  const accountServ = inject(AccountService);
  const token = authServ.getToken();
  
  console.log(req.url)
  if (!token) // check if token exists
    return next(req);  
  
  const accessToken = token.access
  const refreshToken = token.refresh
  
  let clone = req.clone({
    setHeaders: {
      authorization: 'Bearer ' + accessToken,
    },
  });

  return next(clone).pipe(
    catchError((err) => { // error during request with access token
      if (err.status === 401) {
        authServ.refreshToken(refreshToken).subscribe({ // try get new token from refresh token
          next: (token) => {
            authServ.setToken(token);

            let clone = req.clone({
              setHeaders: {
                authorization: 'Bearer ' + token.access,
              }
            });
            location.reload(); // TODO: check if this is the right way
          },
          error: (err) => { // refresh token is expired => logout
            authServ.removeToken();
            accountServ.account.set(null);
            router.navigate(['accounts/login']);
            alert("Votre session à expiré. Veuillez vous reconnecter.")
          }
        })
      }
      return throwError(() => err);
    })
  );
}
