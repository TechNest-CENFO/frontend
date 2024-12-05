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
import {ModalComponent} from "../../components/modal/modal.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import {ModalService} from "../../services/modal.service";
import {CommonModule, NgClass} from "@angular/common";
import {OutfitsService} from "../../services/outfits.service";
import {AuthService} from "../../services/auth.service";
import {OutfitsListComponent} from "../../components/outfits/outfits-list/outfits-list.component";
import {OutfitsFormComponent} from "../../components/outfits/outfits-form/outfits-form.component";
import {FormBuilder, Validators} from "@angular/forms";
import {IClothing, IOutfit, IWeather} from "../../interfaces";
import {
    OutfitsAddClothingFormComponent
} from "../../components/outfits/outfits-form/outfits-add-clothing-form/outfits-add-clothing-form.component";
import {ClothingService} from "../../services/clothing.service";
import {SearchComponent} from '../../components/search/search.component';
import {PlacesService} from '../../services/places.service';
import {WeatherService} from '../../services/weather.service';
import {
    RecommendationCardComponent
} from "../../components/recommendations/recommendation-card/recommendation-card.component";

@Component({
    selector: 'app-outfits',
    standalone: true,
    imports: [
        NgClass,
        RecommendationCardComponent,
        CommonModule
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
    temp: string = '0';
    private _placesService: PlacesService = inject(PlacesService);
    public weatherService: WeatherService = inject(WeatherService)
    public location?: [number, number];
    lat: string = '';
    lon: string = '';
    weatherData!: IWeather;
    outfitTrendings: IOutfit[] = [];

    outfit? = [1, 2, 3, 4, 5]

    outfitTrendingData:  IOutfit = {
    clothing:[]
    };


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
        this.callGet();
        this.setClothingSignalForSubModal();

        runInInjectionContext(this.injector, () => {
            effect(() => {
                this.outfits = this.outfitsService.outfit$();
                this.filteredOutfits = [...this.outfits];
            });
        });
        this.clothingService.getAllByUser();
        this.getTrendingOutfits();

    }


    onSearchTermChanged(searchTerm: string): void {
        this.filteredOutfits = this.outfits.filter(item =>
            item.name?.toLowerCase().includes(searchTerm)
        );
    }

    callGet() {
    if (this.getBy === 'weekly') {
        this.outfitsService.getAllByUser();
    } else if (this.getBy === 'Tendencias') {
        
    } 
}

    capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    saveOutfit(outfit: IOutfit) {
        if (outfit.user) {
            outfit.user.id = this.AuthService.getUser()?.id;
        }
        console.log(outfit);
        this.outfitsService.save(outfit);
        this.ModalService.closeAll();
    }

    public setClotingAddToOutfit(clothing: IClothing[]) {
        this.manualOutfitClothing = clothing;
    }

    refreshClothingContext() {
        this.manualOutfitClothing = []
    }

    callGetOutfitByUserRandom(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.outfitsService.getOutfitByUserRandom(this.weatherData.feels_like ?? '22').subscribe({
                next: (response) => {
                    resolve(response.data);
                },
                error: (err) => {
                    console.error("Error", err);
                    reject(err);
                }
            });
        });
    }

    public async getLocation(): Promise<void> {
        await this._placesService.getUserLocation();
        this.location = this._placesService.getLocation();
        this.lat = this.location[1].toString();
        this.lon = this.location[0].toString();
        this.getWeatherBylatAndlon();

    }

    async getWeatherBylatAndlon(): Promise<void> {
        try {
            await this.weatherService.getWeatherWithLatAndLong(this.lat, this.lon);
            this.weatherService.weather$.subscribe({
                next: (data: any) => {
                    if (data) {
                        this.weatherData = data;


                    }
                }
            });
        } catch (error) {
            console.error('Error al obtener el clima:', error);
        }

    }

    setRecommendationOption(recommendationOption: string) {
        this.recommendationOption = recommendationOption;
        console.log(this.recommendationOption)
    }

    generateRecommendation() {
        if (this.recommendationOption==='weekly'){
        } else  {
            
        }
    }

        getTrendingOutfits(): void {
        this.outfitsService.getTrendigOutfits().subscribe({
            next: (response) => {
                this.outfitTrendings = response.data; 
            },
            error: (err) => console.error(err),
        });
    }

    
}
