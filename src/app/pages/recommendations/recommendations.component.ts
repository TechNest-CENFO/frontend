import { IOutfit } from './../../interfaces/index';
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    effect,
    inject,
    Injector,
    OnInit,
    runInInjectionContext,
    ViewChild
} from '@angular/core';

import {PaginationComponent} from "../../components/pagination/pagination.component";
import {ModalService} from "../../services/modal.service";
import {NgClass} from "@angular/common";
import {OutfitsService} from "../../services/outfits.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {IClothing, IWeather} from "../../interfaces";
import {ClothingService} from "../../services/clothing.service";
import {WeatherService} from '../../services/weather.service';
import {
    RecommendationCardComponent
} from "../../components/recommendations/recommendation-card/recommendation-card.component";

@Component({
    selector: 'app-outfits',
    standalone: true,
    imports: [
        PaginationComponent,
        NgClass,
        RecommendationCardComponent,
    ],
    templateUrl: './recommendations.component.html',
    styleUrl: './recommendations.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class RecommendationsComponent implements OnInit {
    public outfitsService: OutfitsService = inject(OutfitsService);
    public clothingService: ClothingService = inject(ClothingService);
    public ModalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    outfitRandomData: IOutfit[] = [];
    private injector = inject(Injector);
    outfits: IOutfit[] = [];
    filteredOutfits: IOutfit[] = [];   
    public weatherService: WeatherService = inject(WeatherService)
    public location?: [number, number];
    lat: string = '';
    lon: string = '';
    weatherData!: IWeather;
    outfit? = [1, 2, 3, 4, 5]
    usertemp: { _temp: string }| null = null;
    tempCache:string | undefined;
    


    //INICIO - METODOS Y VARIABLES PARA EL SUBMODAL
    //Variable para parametrizar la busqueda de prendas desde el submodal
    getByOption: string = 'all';

    //Funcion para settear la variable de busqueda de prendas en el submodal
    getBy = 'weekly';
    public setGetByOption(getByOption: string) {
        this.getByOption = getByOption;
        this.setClothingSignalForSubModal();
    }

    //Settear el signal de prendas para traer todas las prendas por usuario y settear el allClothingByUser con el signal
    public setClothingSignalForSubModal() {
        if (this.getByOption === 'all') {
            this.clothingService.getAllByUserLongPagination();
        } else if (this.getByOption === 'favorite') {
            this.clothingService.getAllFavoritesByUserLongPagination();
        } else {
            this.clothingService.getAllByTypeLongPagination(this.getByOption);
        }
    }

    //FIN - METODOS Y VARIABLES PARA EL SUBMODAL

    //Prendas a agregar al outfitManual
    manualOutfitClothing: IClothing[] = [];

    @ViewChild('AddOutfitModal')
    public fb: FormBuilder = inject(FormBuilder);
    outfitForm = this.fb.group({
        name: ['', Validators.required],
        clothing: ['', Validators.required],
        user: this.AuthService.getUser()
    });

    recommendationOption: string = "weekly";

    ngOnInit(): void {


        this.usertemp= this.weatherService.getWeatherCache();
        const weatherData=sessionStorage.getItem('userTempreatureWithGeolocation');
        const parsedData = weatherData ? JSON.parse(weatherData):null;
        this.tempCache = parsedData!.temperature;
    }



    capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }



    public setClotingAddToOutfit(clothing: IClothing[]) {
        this.manualOutfitClothing = clothing;
    }

    refreshClothingContext() {
        this.manualOutfitClothing = []
    }


    setIsFavorite(outfit: IOutfit) {
        console.log(outfit)
        if (outfit.isFavorite) {
            this.outfitsService.isFavorite(outfit, true, this.getBy);
        } else {
            this.outfitsService.isFavorite(outfit, false, this.getBy);
        }
    }

    setIsPublic(outfit: IOutfit) {
        console.log(outfit);

        console.log(outfit.isPublic);
        if (outfit.isPublic) {
            console.log('enter ispublic if');
            this.outfitsService.isPublic(outfit, true);
        } else {
            console.log('enter ispublic else');
            this.outfitsService.isPublic(outfit, false);
        }
    }
 

    setRecommendationOption(recommendationOption: string) {
        this.recommendationOption = recommendationOption;
        console.log(this.recommendationOption)
    }

    generateRecommendation() {
    if (this.recommendationOption === 'weekly') {
        this.getWeeklyOutfits();
    } else if (this.recommendationOption === 'trend') {
        this.getTrendingOutfits();
    }
}

getTrendingOutfits(): void {
    this.outfitsService.getTrendigOutfits().subscribe({
        next: (response) => {
            
            this.filteredOutfits = response.data.map(outfit => ({
                ...outfit,
                clothing: outfit.clothing.length ? outfit.clothing : [{ imageUrl: outfit.imageUrl, name: '', season: '', color: '' } as IClothing]
            }));

            console.log("Outfit generado por tendencias:", this.outfits);
        },
        error: (err) => {
            console.error("Error al obtener outfits de tendencias:", err);
        },
    });
}

    getWeeklyOutfits(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("llama al servicio");
            this.outfitsService.getWeeklyOutfitByUser(this.tempCache ?? '22').subscribe({
                next: (response) => {                    
                    this.outfits = response.data;
                    
                    this.outfits[0].name = "Lunes";
                    this.outfits[1].name = "Martes";
                    this.outfits[2].name = "Miercoles";
                    this.outfits[3].name = "Jueves";
                    this.outfits[4].name = "Viernes";
                    this.outfits[5].name = "Sabado";
                    this.outfits[6].name = "Domingo";
                    console.log("this.outfits", this.outfits);                 
                    
                },
                error: (err) => {
                    console.error("Error", err);
                    reject(err);
                }
            });
        });
    }
}