import {Injectable} from '@angular/core';
import {BaseService} from "./base-service";
import {IResponse, IToAddress} from "../interfaces";
import {catchError, Observable, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PasswordRecoveryService extends BaseService<IToAddress> {
    protected override source: string = 'password-recovery';

    public sendEmail(data: {}): Observable<IResponse<IToAddress>> {
        return this.http.post<IResponse<IToAddress>>(this.source, data).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}
