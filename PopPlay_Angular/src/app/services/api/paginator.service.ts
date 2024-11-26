import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  httpClient = inject(HttpClient);

  navigate(url: string): Observable<any> {
    return this.httpClient.get<any>(url);
  }
}
