import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media, MediaCreate, MediaType } from '../../models/models';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  httpClient = inject(HttpClient);
  accountServ = inject(AccountService)
  apiUrl = environment.apiUrl

  constructor() { }

  create(media: MediaCreate): Observable<Media> {
    const formData = new FormData();
    formData.append('name', media.name.toLowerCase());
    formData.append('type_id', media.type_id.toString());
    formData.append('url', media.url);

    if (media.answers_id.length > 0) {

      media.answers_id.forEach((id) => { 
        formData.append("answers_id", id.toString());
      })
    }
  
    return this.httpClient.post<Media>(this.apiUrl + 'minigame/media/', formData);
  }

  getAll(typeIds? : number[], name? : string): Observable<Media[]> {
    
    let nameQuery = name ? name : '';
    let types = typeIds ? typeIds.join(',') : '';
    return this.httpClient.get<Media[]>(this.apiUrl + `minigame/media/?type__in=${types}&name__icontains=${nameQuery}`);
  }

  getAllByUser(typeIds? : number[], name? : string): Observable<Media[]> {
    if(this.accountServ.account() == null){
      throw new Error("Account not connected");
    }

    let nameQuery = name ? name : '';
    let userId = this.accountServ.account()!.id;
    let types = typeIds ? typeIds.join(',') : '';
    return this.httpClient.get<Media[]>(this.apiUrl + `minigame/media/?type__in=${types}&name__icontains=${nameQuery}&account=${userId}`);
  }

  getAllTypes(): Observable<MediaType[]> {
    return this.httpClient.get<MediaType[]>(this.apiUrl + 'minigame/mediaType/');
  }

}
