import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Media, Minigame, MinigameCreate, Theme, Type } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MinigameService {
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl

  constructor() { }

  create(minigame: MinigameCreate): Observable<Minigame> {
    return this.httpClient.post<Minigame>(this.apiUrl + 'minigame/', minigame);
  }

  get_themes(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(this.apiUrl + 'minigame/theme/');
  }

  get_types(): Observable<Type[]> {
    return this.httpClient.get<Type[]>(this.apiUrl + 'minigame/type/');
  }

  get_medias(): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.apiUrl + 'minigame/media/');
  }
}
