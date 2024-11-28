import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})

export class PlacesService{

    public useLocation!:[number,number] ;

    get isUserLocationReady():boolean{
        return !!this.useLocation;
    }

    constructor(){
        this.getUserLocation();
    }

    public async getUserLocation(): Promise<[number,number]>{
        return new Promise ((resolve, reject)=>{
            navigator.geolocation.getCurrentPosition(                
                ({ coords }) => {
                    console.log(coords.longitude, coords.latitude);
                    this.useLocation = [coords.longitude, coords.latitude];
                    resolve(this.useLocation);
                },
                (err) =>{
                    console.error("No se pudo obtener la geolocalización", err);
                    reject();
                }
            );
        })
    }

    public getLocation(): [number, number] {
        return this.useLocation;
    }
    

    //`
}