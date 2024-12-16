import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportType, MediaQuizReport } from '../../models/models';
import { AccountService } from './account.service';
import { GameTypes } from '../../enums/GameTypes';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  httpClient = inject(HttpClient);
  accountServ = inject(AccountService)
  apiUrl = environment.apiUrl

  getMediaQuizReportType(): Observable<ReportType[]> {
    return this.httpClient.get<ReportType[]>(this.apiUrl + 'minigame/mediaQuizReportType/');
  }

  addReport(objectId: number, objectType: GameTypes, report: MediaQuizReport): Observable<MediaQuizReport> {
    if (objectType == GameTypes.IMAGE_GUESSING || objectType == GameTypes.BLIND_TEST) {
      return this.httpClient.post<MediaQuizReport>(this.apiUrl + `minigame/media/${objectId}/reports/`, report);
    } else if (objectType == GameTypes.QUIZZ) {
      return this.httpClient.post<MediaQuizReport>(this.apiUrl + `minigame/quiz/${objectId}/reports/`, report);
    } else {
      return this.httpClient.post<MediaQuizReport>(this.apiUrl + `minigame/${objectId}/reports/`, report);
    }
  }

  getReports(accountId?: number, mediaId?: number, quizId?: number, reportTypeId?: number): Observable<MediaQuizReport[]> {
    return this.httpClient.get<MediaQuizReport[]>(this.apiUrl + `minigame/mediaQuizReport/?account=${accountId}&media=${mediaId}&quiz=${quizId}&reportType=${reportTypeId}`);
  }
}
