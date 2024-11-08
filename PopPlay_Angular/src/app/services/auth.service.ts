import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AccountLogin, AccountRegister } from '../models/models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isConnected = signal<boolean>(false);
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl

  login(credential: AccountLogin): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/token/', credential);
  }
  
  register(account: AccountRegister): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/register/', account);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/token/refresh/', {refresh: refreshToken})
  }

  setToken(token: any) {
    token = JSON.stringify(token);
    localStorage.setItem('token', token); // save token in local storage;
    this.isConnected.set(true);
  }

  removeToken() {
    localStorage.removeItem('token');
    this.isConnected.set(false);
  }

  getToken(): any | null {
    let token = localStorage.getItem('token');

    if (token != null) {
      this.isConnected.set(true)
      token = JSON.parse(token);
    }else{
      this.isConnected.set(false);
    }

    return token ? token : null;
  }

  getConnectedUser(): number | null {
    let token = this.getToken();
    if (!token)
      return null;
    token = jwtDecode(token.access);
    return token.account_id;
  }
}
