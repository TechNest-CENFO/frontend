import { Injectable } from '@angular/core';
import {BaseService} from "./base-service";
import { IPasswordResetEntity, IResponse} from "../interfaces";
import {catchError, Observable, tap, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService extends BaseService<IPasswordResetEntity>{
  protected override source: string = 'password-reset';

  public resetPassword(data: {}): Observable<IResponse<IPasswordResetEntity>> {
    return this.http.put<IResponse<IPasswordResetEntity>>(this.source, data).pipe(
        catchError((error: HttpErrorResponse)=>{
          return throwError(error);
        })
    );
  }
}
