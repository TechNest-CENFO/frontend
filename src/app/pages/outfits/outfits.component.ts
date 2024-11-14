import {Component, inject, OnInit, ViewChild} from '@angular/core';
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
import {FormBuilder} from "@angular/forms";
import {IOutfit} from "../../interfaces";

@Component({
  selector: 'app-outfits',
  standalone: true,
    imports: [
        ClothingListComponent,
        LoaderComponent,
        ModalComponent,
        PaginationComponent,
        PrendasFormComponent,
        NgClass,
        OutfitsListComponent,
        OutfitsFormComponent
    ],
  templateUrl: './outfits.component.html',
  styleUrl: './outfits.component.scss'
})
export class OutfitsComponent implements OnInit{
    public outfitsService: OutfitsService = inject(OutfitsService);
    public ModalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);

    @ViewChild('AddOutfitModal')
    public fb: FormBuilder = inject(FormBuilder);
    outfitForm = this.fb.group({

    });

    getBy: string = "all";
    protected optionSelected: string = 'Tipo';
    gridSelected: boolean = true;

    ngOnInit(): void {
        this.callGet()
    }

    setGetBy(category: string) {
        this.getBy = category;
        this.callGet();
    }

    toggleGirdSelected() {
        this.gridSelected = !this.gridSelected;
    }

    callGet() {
        if (this.getBy == 'all') {
            this.outfitsService.getAllByUser();
            this.optionSelected = 'Tipo';

        } else if (this.getBy == 'favorite') {
            this.outfitsService.getAllFavoritesByUser();
            this.optionSelected = 'Tipo';
            

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

    saveOutfit($event: IOutfit) {
        
    }
}
