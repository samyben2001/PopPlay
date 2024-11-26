import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MinigamePagination } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  httpClient = inject(HttpClient);

  navigate(url: string): Observable<MinigamePagination> {

    let subject = new Subject<MinigamePagination>();

    this.httpClient.get<any>(url).subscribe({
      next: (data) => {
        // FIXME: refacto this
        console.log(data);
        if (url?.includes('account') && url?.includes('games_liked')) {
          subject.next(data.games_liked);
        } else if (url?.includes('account') && url?.includes('minigames')) {
          subject.next(data.minigames);
        } else {
          subject.next(data);
        }
      },
      error: (err) => { console.log(err); }
    });

    return subject.asObservable();
  }
}
