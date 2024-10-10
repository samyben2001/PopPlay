import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media, MediaAnswer, MediaCreate, MediaType } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl

  constructor() { }

  create(media: MediaCreate): Observable<Media> {
    console.log(media);
    const formData = new FormData();
    formData.append('name', media.name);
    formData.append('type_id', media.type_id.toString());
    formData.append('url', media.url);

    if (media.answers_id.length > 0) {

      media.answers_id.forEach((id) => { 
        formData.append("answers_id", id.toString());
      })
      console.log(formData.getAll('answers_id'));
    }
  
    return this.httpClient.post<Media>(this.apiUrl + 'minigame/media/', formData);
  }


  createAnswer(answer: string): Observable<MediaAnswer> {
    return this.httpClient.post<MediaAnswer>(this.apiUrl + 'minigame/mediaAnswer/' , {answer: answer});
  }

  getAllTypes(): Observable<MediaType[]> {
    return this.httpClient.get<MediaType[]>(this.apiUrl + 'minigame/mediaType/');
  }
}
