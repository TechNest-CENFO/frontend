import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {IOutfit} from "../../../../interfaces";
import {
    ConfirmationFormOutfitsComponent
} from "../../../outfits/confirmation-form-outfits/confirmation-form-outfits.component";
import {ModalComponent} from "../../../modal/modal.component";
import {
    OutfitsAddClothingFormComponent
} from "../../../outfits/outfits-form/outfits-add-clothing-form/outfits-add-clothing-form.component";
import {OutfitsEditComponent} from "../../../outfits/outfits-edit/outfits-edit.component";

@Component({
    selector: 'app-collections-manual-outfit-card',
    standalone: true,
    imports: [
        NgClass,
        ConfirmationFormOutfitsComponent,
        ModalComponent,
        OutfitsAddClothingFormComponent,
        OutfitsEditComponent
    ],
    templateUrl: './collections-manual-outfit-card.component.html',
    styleUrl: './collections-manual-outfit-card.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CollectionsManualOutfitCardComponent implements OnInit{
    @Output() outfitOutput = new EventEmitter<IOutfit>();
    @Input() outfit!: IOutfit;

    ngOnInit(){
        if(this.outfit.isSelectedInSubModal === undefined || this.outfit.isSelectedInSubModal){
            this.outfit.isSelectedInSubModal = false;
        }
    }

    public toggleIsSelected() {
        this.outfit.isSelectedInSubModal = !this.outfit.isSelectedInSubModal;
        this.emitClothing();
    }

    public emitClothing() {
        if(this.outfit.isSelectedInSubModal){
            this.outfitOutput.emit(this.outfit);
        }
    };

}
