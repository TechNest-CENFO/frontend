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

    clothing: IClothing[] = [];

    getBy: string = 'all';
    dropdownOptionSelected: string = 'Tipo';

    clothingToAdd: IClothing[] = [];


    ngOnInit() {
        if (this.selectedClothing.length) {
            this.clothingToAdd = this.selectedClothing;
        }
    }

    public setGetBy(getBy: string) {
        this.getBy = getBy;
        if (getBy != 'all' && getBy != 'favorite') {
            this.dropdownOptionSelected = this.capitalizeAndReplace(getBy);
        } else {
            this.dropdownOptionSelected = 'Tipo';
        }
        this.getByValue.emit(getBy);
    }

    public capitalizeAndReplace(text: string): string {
        if (!text) return ''; 
        const formattedText = text.replace(/_/g, ' ');
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
