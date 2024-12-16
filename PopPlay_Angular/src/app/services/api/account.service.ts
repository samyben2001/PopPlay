import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Account } from '../../models/models';
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

  setAccount(id: number) {
    this.httpClient.get<Account>(this.apiUrl + 'account/' + id).subscribe({
      next: (data) => { // get user account data
        this.account.set(data);
      },
      error: (err) => { console.log(err); }
    });
  }

  // TODO: add GetScoreByUser + filter (need new view in django)

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

  delete(id: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + 'account/' + id + '/');
  }
}
