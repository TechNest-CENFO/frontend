import { ClothingTypeService } from './../../services/clothing-type.service';
import {AuthService} from './../../services/auth.service';
import {Component, effect, inject, Injector, OnInit, runInInjectionContext, ViewChild} from '@angular/core';
import {ModalService} from './../../services/modal.service';
import {PrendasFormComponent} from "../../components/loans/prendas-form/prendas-form.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {FormBuilder} from '@angular/forms';
import {LoaderComponent} from '../../components/loader/loader.component';
import {IClothing, IClothingType} from '../../interfaces';
import {NgClass} from "@angular/common";
import {ClothingListComponent} from "../../components/loans/clothing-list/clothing-list.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import { SearchComponent } from '../../components/search/search.component';
import { ClothingCardComponent } from '../../components/loans/clothing-card/clothing-card.component';
import { CommonModule } from '@angular/common'; 
import { LoansService } from '../../services/loans.service';

@Component({
    selector: 'app-prendas',
    standalone: true,
    imports: [
        PrendasFormComponent,
        ModalComponent,
        LoaderComponent,
        NgClass,
        ClothingListComponent,
        PaginationComponent,
        SearchComponent,
        ClothingCardComponent,
        CommonModule
    ],
    templateUrl: './loans.component.html',
    styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
    public loansService: LoansService = inject(LoansService);
    public clothtingTypeService: ClothingTypeService = inject(ClothingTypeService);
    public ModalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
  
    @ViewChild('AddClothingModal')
    public fb: FormBuilder = inject(FormBuilder);
    clothingForm = this.fb.group({
        name: [''],
        isFavorite: [false],
        isPublic: [false],
        imageUrl: [''],
        season: [''],
        color: [''],
        clothingTypeName: [''],
        clothingSubType: [''],
        clothingType: ['']
    });
    clothingTypeData: IClothingType[] = [];
    gridSelected: boolean = true;
    protected getBy: string = 'all';
    protected optionSelected: string = 'Tipo';
    searchTerm: string = '';
    filteredClothing: IClothing[] = [];
    clothingList: IClothing[] = [];
    clothing: IClothing[] = [];
    private injector = inject(Injector);


    constructor() {
        this.getAllTypeClothing();
    }


    ngOnInit(): void {
        this.callGet();

        runInInjectionContext(this.injector, () => {
            effect(() => {
              this.clothing = this.loansService.clothing$();
              this.filteredClothing = [...this.clothing];
            });
          });
          this.loansService.getAllPublicClothingLongPagination();
    }


    onSearchTermChanged(searchTerm: string): void {
        this.filteredClothing = this.clothing.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
            );
    }


    saveClothing(clothing: IClothing) {
        this.loansService.save(clothing);
        this.ModalService.closeAll();

    }


    getAllTypeClothing(): void {
        // Llamamos a getAll() y al Observable para obtener los datos
        this.clothtingTypeService.getAll().subscribe({
            next: (response) => {
                // Accedemos a los datos y los almacenamos en la propiedad clothingTypeData
                this.clothingTypeData = response.data;
            },
            error: (err) => {
                err = "Ocurrió un error al cargar los datos.";
            }
        });
    }

    callGet() {
        if (this.getBy == 'all') {
            this.loansService.getAllByUser();
            this.optionSelected = 'Tipo';

        } else if (this.getBy == 'favorite') {
            this.loansService.getAllFavoritesByUser();
            this.optionSelected = 'Tipo';

        } else {
            this.loansService.getAllByType(this.getBy);
            this.optionSelected = this.capitalizeAndReplace(this.getBy);
        }
    }

    //Función para formatear string
    capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    toggleGirdSelected() {
        this.gridSelected = !this.gridSelected;
    }

    setGetBy(type: string) {
        this.getBy = type;
        this.callGet();
    }
}
