import { inject } from '@angular/core';
import { PlacesService } from './../../services/places.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherServiceTEst } from '../../services/weather.service';
import { IWeather } from '../../interfaces';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  city!: string;
  weatherData!: IWeather;
  public location?:[number,number];
  currentDate = new Date();
  private intervalId: any;
  imageUrl: string = '';
  lat:string = '';
  lon:string ='';
  

  public militaryTime!:string;
  public formattedDate!:string ;
  public weatherService: WeatherServiceTEst = inject(WeatherServiceTEst)
  private _placesService:PlacesService = inject(PlacesService);

  ngOnInit(): void {   
    
    this.getLocation();   
    this.getWeatherBylatAndlon(); 
    this.formattedDate=this.getFormattedDate();
    this.intervalId = setInterval(() => {
      this.updateDateTime();      
    }, 1000);

  }

  //API para 5 días dejar prevista
  async getWeather(){   
    try {    
      await this.getWeatherByCity();
      //await new Promise(resolve => setTimeout(resolve, 2000)); 
      this.weatherService.weather$.subscribe({
        next: (data:any) => {
          if (data) {
            this.weatherData = data;
            this.imageUrl=this.getImageForWeather(Number(this.weatherData.id));
       
          }
        }
      });
    } catch (error) {
      console.error('Error al ejecutar getWeather:', error);
    }
  }

  async getWeatherBylatAndlon(): Promise<void> {
    try {
      await this.weatherService.getWeatherWithLatAndLong(this.lat, this.lon);
      this.weatherService.weather$.subscribe({
        next: (data:any) => {
          if (data) {
            this.weatherData = data;     
            this.imageUrl=this.getImageForWeather(Number(this.weatherData.id));
       
          }
        }
      });       
    } catch (error) {
      console.error('Error al obtener el clima:', error);
    }
   
  }


  async getWeatherByCity(): Promise<void> {
    try {
      await this.weatherService.getWeather(this.city);       
    } catch (error) {
      console.error('Error al obtener el clima:', error);
    }
   
  }



  private getImageForWeather(id: number): string {
    const weatherImages = [
      { range: [200, 232], image: 'assets/img/weather/tormentaElectrica.jpg' },
      { range: [300, 321], image: 'assets/img/weather/Llovizna.jpg' },
      { range: [500, 531], image: 'assets/img/weather/Lluvia.jpg' },
      { range: [600, 622], image: 'https://i.imgur.com/dpqZJV5.jpg' },
      { range: [700, 781], image: 'assets/img/weather/neblina.jpg' },
      { range: [800, 800], image: 'assets/img/weather/cieloDespejado.jpg' },
      { range: [801, 802], image: 'assets/img/weather/PocasNubes.jpg' },
      { range: [803, 999], image: 'assets/img/weather/MuchasNubes.jpg' }
    ];
    
    const found = weatherImages.find(entry => id >= entry.range[0] && id <= entry.range[1]);

    
    return found ? found.image : 'assets/img/weather/default.jpg';;
  }

  public async getLocation(): Promise<void> {
    await this._placesService.getUserLocation();
    this.location = this._placesService.getLocation();
    this.lat = this.location[1].toString();
    this.lon = this.location[0].toString();
    this.getWeatherBylatAndlon();

    
  }

  updateDateTime(): void {
    const date = this.getFormattedDate();
    const time = this.getMilitaryTime();
  }

  getFormattedDate(): string {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',  
      day: '2-digit',    
      month: 'long',     
      year: 'numeric',  
    };
    return currentDate.toLocaleDateString('es-ES', options);
  }

  getMilitaryTime() {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    this.militaryTime= `${hours}:${minutes}:${seconds}`;
    
  }

  

}


