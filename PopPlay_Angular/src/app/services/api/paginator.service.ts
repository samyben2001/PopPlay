import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  httpClient = inject(HttpClient);

  navigate(url: string): Observable<any> {

    let subject = new Subject<any>();

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
