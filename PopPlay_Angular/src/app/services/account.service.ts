import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AccountLogin, AccountRegister } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl

  constructor() { }

  register(account: AccountRegister): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/register/', account);
  }

  login(credential: AccountLogin): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/token/', credential);
  }
}
