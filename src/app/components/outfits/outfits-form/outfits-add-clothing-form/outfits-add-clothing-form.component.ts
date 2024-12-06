import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {IClothing} from "../../../../interfaces";
import {NgClass} from "@angular/common";
import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {
    OutfitsManualClothingCardComponent
} from "../outfits-manual-clothing-card/outfits-manual-clothing-card.component";
import {NotyfService} from "../../../../services/notyf.service";
import {filter} from "rxjs";

@Component({
    selector: 'app-outfits-add-clothing-form',
    standalone: true,
    imports: [
        NgClass,
        OutfitsManualClothingCardComponent
    ],
    templateUrl: './outfits-add-clothing-form.component.html',
    styleUrl: './outfits-add-clothing-form.component.scss'
})
export class OutfitsAddClothingFormComponent implements OnInit {
    @Input() clothingList!: IClothing[];
    @Input() selectedClothing!: IClothing[];
    @Output() callSetClothing = new EventEmitter<IClothing[]>();
    @Output() getByValue = new EventEmitter<string>();
    @Output() toggleAddClothingModal = new EventEmitter<void>();

    private notyfService: NotyfService = inject(NotyfService);

    //Array que guarda las prednas que luego se despliegan en la lista del submodal para luego poder ser seleccionadas como prendas a agregar
    clothing: IClothing[] = [];
    //Parametro para filtrar las prendas del mostradas en el submodal
    getBy: string = 'all';
    dropdownOptionSelected: string = 'Tipo';

    //Array para guardar las prendas seleccionadas en el submodal
    clothingToAdd: IClothing[] = [];

    //

    ngOnInit() {
        console.log('on inint selected clothing: ', this.selectedClothing);
        if (this.selectedClothing.length) {
            this.clothingToAdd = this.selectedClothing;
        }
        console.log('on init to add> ', this.clothingToAdd);
    }

    public setGetBy(getBy: string) {
        this.getBy = getBy;
        if (getBy != 'all' && getBy != 'favorite') {
            this.dropdownOptionSelected = this.capitalizeAndReplace(getBy);
        } else {
            this.dropdownOptionSelected = 'Tipo';
        }
        console.log(this.getBy)
        this.getByValue.emit(getBy);
    }

    public capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    public addClothing(item: IClothing) {
        this.clothingToAdd = [];
        if (item.isSelectedInSubModal && !this.selectedClothing.includes(item)) {
            this.selectedClothing.push(item);
        }
    }

    public callSaveClothing() {
        if (this.selectedClothing.length) {
            this.clothingToAdd = this.selectedClothing.filter(clothing => clothing.isSelectedInSubModal);

            if (this.clothingToAdd.length >= 2 && this.clothingToAdd.length <= 6) {
                this.callSetClothing.emit(this.clothingToAdd);

                this.toggleAddClothingModal.emit();
            } else {
                this.notyfService.error('Por favor selecciona entre 2 y 6 prendas.');
            }
        } else {
            this.notyfService.error('Ha ocurrido un error, por favor intenta nuevamente.');
        }
    }

}
