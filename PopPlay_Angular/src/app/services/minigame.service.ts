import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Media, Minigame, MinigameCreate, Theme, ThemeCategory, Type } from '../models/models';

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
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); // => should work but doesn't
      minigame.medias_id.forEach((media: any) => formData.append('medias_id', media.id.toString()));
    }

    return this.httpClient.post<Minigame>(this.apiUrl + 'minigame/', formData);
  }

  update(minigame: MinigameCreate): Observable<Minigame>{
    
    const formData = new FormData();
    formData.append('name', minigame.name);
    formData.append('type_id', minigame.type_id.toString());
    formData.append('theme_id', minigame.theme_id.toString());
    if (typeof minigame.cover_url === 'object') 
      formData.append('cover_url', minigame.cover_url);

    if (minigame.medias_id.length > 0){
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); // => should work but doesn't
      minigame.medias_id.forEach((media: any) => formData.append('medias_id', media.id.toString()));
    }
    
    return this.httpClient.put<Minigame>(this.apiUrl + 'minigame/' + minigame.id + '/', formData)
  }

  get_all(): Observable<Minigame[]> {
    return this.httpClient.get<Minigame[]>(this.apiUrl + 'minigame/');
  }

  get_by_id(id: number): Observable<Minigame> {
    return this.httpClient.get<Minigame>(this.apiUrl + 'minigame/' + id);
  }

  create_theme(theme: Theme): Observable<Theme> {
    let body = {
      name: theme.name,
      category_id: theme.category
    }
    
    return this.httpClient.post<Theme>(this.apiUrl + 'minigame/theme/', body);
  }

  get_themes(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(this.apiUrl + 'minigame/theme/');
  }

  get_themeCategories(): Observable<ThemeCategory[]> {
    return this.httpClient.get<ThemeCategory[]>(this.apiUrl + 'minigame/themeCategory/');
  }

  get_types(): Observable<Type[]> {
    return this.httpClient.get<Type[]>(this.apiUrl + 'minigame/type/');
  }

  get_medias(): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.apiUrl + 'minigame/media/');
  }
}
