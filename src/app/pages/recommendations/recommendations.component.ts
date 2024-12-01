import {Component, effect, inject, Injector, OnInit, runInInjectionContext, ViewChild} from '@angular/core';
import {ClothingListComponent} from "../../components/prendas/clothing-list/clothing-list.component";
import {LoaderComponent} from "../../components/loader/loader.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import {PrendasFormComponent} from "../../components/prendas/prendas-form/prendas-form.component";
import {ModalService} from "../../services/modal.service";
import {NgClass} from "@angular/common";
import {OutfitsService} from "../../services/outfits.service";
import {AuthService} from "../../services/auth.service";
import {OutfitsListComponent} from "../../components/outfits/outfits-list/outfits-list.component";
import {OutfitsFormComponent} from "../../components/outfits/outfits-form/outfits-form.component";
import {FormBuilder, Validators} from "@angular/forms";
import {ICategory, IClothing, IClothingType, IOutfit, IUser, IWeather} from "../../interfaces";
import {
    OutfitsAddClothingFormComponent
} from "../../components/outfits/outfits-form/outfits-add-clothing-form/outfits-add-clothing-form.component";
import {ClothingService} from "../../services/clothing.service";
import { SearchComponent } from '../../components/search/search.component';
import { PlacesService } from '../../services/places.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-outfits',
  standalone: true,
    imports: [
        ModalComponent,
        PaginationComponent,
        NgClass,
        OutfitsListComponent,
        OutfitsFormComponent,
        OutfitsAddClothingFormComponent,
        SearchComponent
    ],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss'
})
export class RecommendationsComponent implements OnInit{
    public outfitsService: OutfitsService = inject(OutfitsService);
    public clothingService: ClothingService = inject(ClothingService);
    public ModalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    outfitRandomData:IOutfit[]=[];
    private injector = inject(Injector);
    outfits: IOutfit[] = [];
    filteredOutfits: IOutfit[] = [];
    temp:string = '0';
    private _placesService:PlacesService = inject(PlacesService);
    public weatherService: WeatherService = inject(WeatherService)
    public location?:[number,number];
    lat:string = '';
    lon:string ='';
    weatherData!: IWeather;



    //INICIO - METODOS Y VARIABLES PARA EL SUBMODAL
    //Variable para parametrizar la busqueda de prendas desde el submodal
    getByOption: string = 'all';
    //Funcion para settear la variable de busqueda de prendas en el submodal
    public setGetByOption(getByOption: string) {
        this.getByOption = getByOption;
        this.setClothingSignalForSubModal();
    }
    //Settear el signal de prendas para traer todas las prendas por usuario y settear el allClothingByUser con el signal
    public setClothingSignalForSubModal() {
        if (this.getByOption==='all'){
            this.clothingService.getAllByUserLongPagination();
        } else if (this.getByOption === 'favorite'){
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

    getBy: string = "all";
    protected optionSelected: string = 'Tipo';
    gridSelected: boolean = true;
    isAddClothingModalActive: boolean = false;

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
    }


    onSearchTermChanged(searchTerm: string): void {
        this.filteredOutfits = this.outfits.filter(item =>
            item.name?.toLowerCase().includes(searchTerm)
        );
    }



    setGetBy(category: string) {
        console.log("setGetBy")
        this.optionSelected=category; 
      
        this.callGet();
    }

    toggleGirdSelected() {
        this.gridSelected = !this.gridSelected;
    }

    callGet() {
        if (this.getBy == 'weekly') {            
            this.outfitsService.getAllByUser();
            this.optionSelected = 'Semanal';

        } else if (this.getBy == 'Tendencias') {
            this.outfitsService.getAllFavoritesByUser();
            this.optionSelected = 'Tendencias';
            

        } else {
            this.outfitsService.getAllByType(this.getBy);
            this.optionSelected = this.capitalizeAndReplace(this.getBy);
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

    toggleAddClothingModal() {
        this.isAddClothingModalActive = !this.isAddClothingModalActive;
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
            next: (data:any) => {
              if (data) {
                this.weatherData = data;     
                
           
              }
            }
          });       
        } catch (error) {
          console.error('Error al obtener el clima:', error);
        }
       
      }
}
