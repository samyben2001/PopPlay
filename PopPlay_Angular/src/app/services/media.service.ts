import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media, MediaType } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl

  constructor() { }

  create(media: Media): Observable<Media> {
    return this.httpClient.post<Media>(this.apiUrl + 'minigame/media/', media);
  }

  getAllTypes(): Observable<MediaType[]> {
    return this.httpClient.get<MediaType[]>(this.apiUrl + 'minigame/mediaType/');
  }
}
