import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isConnected = signal<boolean>(false);

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
    return token.user_id;
  }
}
