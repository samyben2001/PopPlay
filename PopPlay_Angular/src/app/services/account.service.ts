import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AccountLogin, AccountRegister } from '../models/models';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  httpClient = inject(HttpClient);
  authServ = inject(AuthService)
  apiUrl = environment.apiUrl

  constructor() { }

  register(account: AccountRegister): Observable<any> {
    console.log('API URL: ',this.apiUrl)
    return this.httpClient.post(this.apiUrl + 'account/register/', account);
  }

  login(credential: AccountLogin): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/token/', credential);
  }

  addScore(gameid: number, score: number): Observable<any> {
    let userid = this.authServ.getConnectedUser()

    if (!userid)
      throw new Error("You must be connected to add a score");

    return this.httpClient.post(this.apiUrl + `account/${userid}/scores/`, {minigame: gameid, score: score});
  }
}
