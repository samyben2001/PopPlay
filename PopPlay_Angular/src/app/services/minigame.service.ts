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
    const formData = new FormData();
    formData.append('name', minigame.name);
    formData.append('type_id', minigame.type_id.toString());
    formData.append('theme_id', minigame.theme_id.toString());
    formData.append('cover_url', minigame.cover_url);

    if (minigame.medias_id.length > 0){
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); => should work but doesn't
      minigame.medias_id.forEach(id => formData.append('medias_id', id.toString()));
    }

    return this.httpClient.post<Minigame>(this.apiUrl + 'minigame/', formData);
  }

  get_all(): Observable<Minigame[]> {
    return this.httpClient.get<Minigame[]>(this.apiUrl + 'minigame/');
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
