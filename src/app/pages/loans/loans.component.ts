import { ClothingTypeService } from './../../services/clothing-type.service';
import {Component, inject, Injector, OnInit, ViewChild} from '@angular/core';
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
        CommonModule,
    ],
    templateUrl: './loans.component.html',
    styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
    public loansService: LoansService = inject(LoansService);
    public clothtingTypeService: ClothingTypeService = inject(ClothingTypeService);
    public ModalService: ModalService = inject(ModalService);

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
        this.loansService.getAllPublicClothing().subscribe({
            next: (publicClothing) => {
                this.clothing = publicClothing;
                this.filteredClothing = [...publicClothing];
            },
            error: (err) => {
                console.error('Failed to fetch public clothing:', err);
            }
        });
    
      //  this.callGet();
    }
    
    searchClothing(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.filteredClothing = [...this.clothing];
            return;
        }
    
        this.filteredClothing = this.clothing.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
        this.clothtingTypeService.getAll().subscribe({
            next: (response) => {
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

        } else if (this.getBy == 'solicitudes') {
            this.loansService.getAllFavoritesByUser();
            this.optionSelected = this.capitalizeAndReplace(this.getBy);

        } else if (this.getBy == 'loans') {
            this.loansService.getAllFavoritesByUser();
            this.optionSelected = this.capitalizeAndReplace(this.getBy);

        } else if(this.getBy == 'lends') {
            this.loansService.getAllFavoritesByUser();
            this.optionSelected = this.capitalizeAndReplace(this.getBy);
            
        } else{
            this.loansService.getAllByType(this.getBy);
            this.optionSelected = this.capitalizeAndReplace(this.getBy);
            
        }
    }

    capitalizeAndReplace(text: string): string {
        if (!text) return '';
        const formattedText = text.replace(/_/g, ' ');
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
