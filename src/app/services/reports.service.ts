import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { BehaviorSubject, Observable } from "rxjs";
import { IResponse } from "../interfaces";

@Injectable({
    providedIn: 'root',
})
export class ReportsService extends BaseService<Object>{
    protected override source: string = 'reports';



    getReportsByMonth(): Observable<IResponse<any[]>>{
        return this.getCustomUrl("month");
    }

    getGeneralReports(): Observable<IResponse<any[]>>{
        return this.getCustomUrl("users");
    }

 
}