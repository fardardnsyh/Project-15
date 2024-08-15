import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/domain';
import {
  AddQuizPayload,
  AddQuizResultsPayload,
  AddQuizResultsSuccessPayload,
  AddQuizResultsSuccessResponse,
  AddQuizSuccessPayload,
  AddQuizSuccessResponse,
  EditQuizPayload,
  EditQuizSuccessPayload,
  EditQuizSuccessResponse,
  RemoveQuizPayload,
  RemoveQuizSuccessPayload,
  RemoveQuizSuccessResponse,
} from '@jhh/jhh-client/dashboard/practice/domain';

@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  addQuiz(payload: AddQuizPayload): Observable<AddQuizSuccessPayload> {
    return this.http
      .post<AddQuizSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddPracticeQuiz,
        {
          name: payload.name,
          description: payload.description,
          imageUrl: payload.imageUrl,
          items: payload.items,
        }
      )
      .pipe(map((res: AddQuizSuccessResponse) => res.data));
  }

  editQuiz(payload: EditQuizPayload): Observable<EditQuizSuccessPayload> {
    return this.http
      .put<EditQuizSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditPracticeQuiz,
        {
          quizId: payload.quizId,
          slug: payload.slug,
          name: payload.name,
          description: payload.description,
          imageUrl: payload.imageUrl,
          items: payload.items,
        }
      )
      .pipe(map((res: EditQuizSuccessResponse) => res.data));
  }

  removeQuiz(payload: RemoveQuizPayload): Observable<RemoveQuizSuccessPayload> {
    return this.http
      .delete<RemoveQuizSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemovePracticeQuiz,
        {
          params: { quizId: payload.quizId },
        }
      )
      .pipe(map((res: RemoveQuizSuccessResponse) => res.data));
  }

  addQuizResults(
    payload: AddQuizResultsPayload
  ): Observable<AddQuizResultsSuccessPayload> {
    return this.http
      .post<AddQuizResultsSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddPracticeQuizResults,
        {
          quizId: payload.quizId,
          items: payload.items,
          totalScore: payload.totalScore,
          percentage: payload.percentage,
        }
      )
      .pipe(map((res: AddQuizResultsSuccessResponse) => res.data));
  }
}
