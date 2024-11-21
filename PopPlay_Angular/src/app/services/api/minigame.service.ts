import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Media, Answer, Minigame, MinigameCreate, QuizCreate, Theme, ThemeCategory, Type, Question, Quiz } from '../../models/models';

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

    if (minigame.medias_id.length > 0) {
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); // => should work but doesn't
      minigame.medias_id.forEach((media: any) => formData.append('medias_id', media.id.toString()));
    }

    if (minigame.quizz_id.length > 0) {
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); // => should work but doesn't
      minigame.quizz_id.forEach((quizz: any) => formData.append('quizz_id', quizz.id.toString()));
    }

    return this.httpClient.post<Minigame>(this.apiUrl + 'minigame/', formData);
  }

  update(minigame: MinigameCreate): Observable<Minigame> {

    const formData = new FormData();
    formData.append('name', minigame.name);
    formData.append('type_id', minigame.type_id.toString());
    formData.append('theme_id', minigame.theme_id.toString());
    console.log(minigame.cover_url)
    if (typeof minigame.cover_url === 'object')
      formData.append('cover_url', minigame.cover_url);

    if (minigame.medias_id.length > 0) {
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); // => should work but doesn't
      minigame.medias_id.forEach((media: any) => formData.append('medias_id', media.id.toString()));
    }

    if (minigame.quizz_id.length > 0) {
      // formData.append('medias_id', JSON.stringify(minigame.medias_id)); // => should work but doesn't
      minigame.quizz_id.forEach((quizz: any) => formData.append('quizz_id', quizz.id.toString()));
    }

    return this.httpClient.put<Minigame>(this.apiUrl + 'minigame/' + minigame.id + '/', formData)
  }

  get_all(name?: string, typeIds?: number[], themeIds?: number[]): Observable<Minigame[]> {
    let nameQuery = name ? name : '';
    let types = typeIds ? typeIds.join(',') : '';
    let themes = themeIds ? themeIds.join(',') : '';
    return this.httpClient.get<Minigame[]>(this.apiUrl + `minigame/?name__icontains=${nameQuery}&type__in=${types}&theme__in=${themes}`);
  }

  get_by_id(id: number): Observable<Minigame> {
    return this.httpClient.get<Minigame>(this.apiUrl + 'minigame/' + id);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + 'minigame/' + id + '/');
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

  create_answer(answer: string): Observable<Answer> {
    return this.httpClient.post<Answer>(this.apiUrl + 'minigame/answer/', { answer: answer });
  }

  get_medias(): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.apiUrl + 'minigame/media/');
  }

  get_likes(id: number): Observable<number[]> {
    return this.httpClient.get<number[]>(this.apiUrl + 'minigame/' + id + '/likes/');
  }

  create_question(question: string): Observable<Question> {
    return this.httpClient.post<Question>(this.apiUrl + 'minigame/question/', { question: question });
  }

  create_quizz(quiz: QuizCreate): Observable<Quiz> {
    return this.httpClient.post<Quiz>(this.apiUrl + 'minigame/quiz/', quiz);
  }
}
