
import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IResponse, IWeather } from "../interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { AlertService } from "./alert.service";

@Injectable({
    providedIn:'root'
})

export class WeatherService extends BaseService<IWeather>{
    private weatherSubject = new BehaviorSubject<any>(null); 
    protected override source: string  = 'weather';
    public foundWeather: IWeather = {};
    private alertService: AlertService = inject(AlertService);
    private foundSignal = signal<IWeather>({});
    
    public weather$ = this.weatherSubject.asObservable();


    async getWeather(city:string): Promise<void>{
        this.find(city).subscribe({
            next: async (response: any) => {
                await this.weatherSubject.next(response.data);
            },
            error: (err) => {
                this.alertService.displayAlert('error', 'An error occurred deleting the user','center', 'top', ['error-snackbar']);
            }
        });
    }

       

  

    getWeatherWithLatAndLong(lat:string, lon:string){
        
        if(lat !=="" ){
            this.getCustomUrl(`${lat}/${lon}`).subscribe({
                next: async (response: any) => {
                    this.weatherSubject.next(response.data);
                },
                error: (err) => {
                    this.alertService.displayAlert('error', err,'center', 'top', ['error-snackbar']);
                }
            });

        }        
        
    }

    
}

