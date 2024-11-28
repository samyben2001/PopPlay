import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media, MediaCreate, MediaType } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl

  constructor() { }

  create(media: MediaCreate): Observable<Media> {
    const formData = new FormData();
    formData.append('name', media.name);
    formData.append('type_id', media.type_id.toString());
    formData.append('url', media.url);

    if (media.answers_id.length > 0) {

      media.answers_id.forEach((id) => { 
        formData.append("answers_id", id.toString());
      })
    }
  
    return this.httpClient.post<Media>(this.apiUrl + 'minigame/media/', formData);
  }

  getAll(typeId? : number): Observable<Media[]> {
    console.log(typeId)
    if (typeId == null)
      return this.httpClient.get<Media[]>(this.apiUrl + 'minigame/media/');
    return this.httpClient.get<Media[]>(this.apiUrl + 'minigame/media/?type=' + typeId);
  }

  getAllTypes(): Observable<MediaType[]> {
    return this.httpClient.get<MediaType[]>(this.apiUrl + 'minigame/mediaType/');
  }

}
