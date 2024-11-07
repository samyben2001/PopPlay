import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Account, AccountLogin, AccountRegister } from '../models/models';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  httpClient = inject(HttpClient);
  authServ = inject(AuthService)
  apiUrl = environment.apiUrl
  account = signal<Account | null>(null)

  register(account: AccountRegister): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'account/register/', account);
  }

  setAccount(id: number) {
    this.httpClient.get<Account>(this.apiUrl + 'account/' + id).subscribe({
      next: (data) => { // get user data
        this.account.set(data);
      },
      error: (err) => { console.log(err); }
    });
  }

  addScore(gameid: number, score: number): Observable<any> {
    let userid = this.authServ.getConnectedUser()

    if (!userid)
      throw new Error("You must be connected to add a score");

    return this.httpClient.post(this.apiUrl + `account/${userid}/scores/`, {minigame: gameid, score: score});
  }

  addLikedGame(gameid: number): Observable<any> {
    let userid = this.authServ.getConnectedUser()

    if (!userid)
      throw new Error("You must be connected to like a game");

    return this.httpClient.post(this.apiUrl + `account/${userid}/favoris/games/`, {games_liked: gameid});
  }
}
