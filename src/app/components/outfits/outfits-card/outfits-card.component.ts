import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { IClothing, IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";
import { ModalComponent } from '../../modal/modal.component';
import { ConfirmationFormOutfitsComponent } from "../confirmation-form-outfits/confirmation-form-outfits.component";
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { OutfitsEditComponent } from "../outfits-edit/outfits-edit.component";
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { OutfitsAddClothingFormComponent } from "../outfits-form/outfits-add-clothing-form/outfits-add-clothing-form.component";
import { ClothingService } from '../../../services/clothing.service';

@Component({
  selector: 'app-outfits-card',
  standalone: true,
  imports: [ModalComponent, ConfirmationFormOutfitsComponent, CommonModule, OutfitsEditComponent, OutfitsAddClothingFormComponent],
  templateUrl: './outfits-card.component.html',
  styleUrls: ['./outfits-card.component.scss']
})
export class OutfitsCardComponent {
    @Input() outfit!: IOutfit;
    @Output() callEditAction: EventEmitter<IOutfit> = new EventEmitter<IOutfit>();
    public modalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    public clothingService: ClothingService = inject(ClothingService);

    onEdit() {
        this.callEditAction.emit(this.outfit);
    }

    isFav: boolean = false;
    isAddClothingModalActive: boolean = false;
    manualOutfitClothing: IClothing[] = [];
    getByOption: string = 'all';

    constructor(private outfitsService: OutfitsService) {}

    toggleIsFav() {
        this.isFav = !this.isFav;
    }

    toggleIsPublic(): void {
        this.outfit.isPublic = !this.outfit.isPublic;
        console.log(`El estado de visibilidad es ahora: ${this.outfit.isPublic ? 'Público' : 'Privado'}`);
    }

    toggleAddClothingModal() {
        this.isAddClothingModalActive = !this.isAddClothingModalActive;
    }

    updateOutfit(outfit: IOutfit) {
    console.log("Actualizando outfit con ID:", outfit.id, "con los siguientes datos:", outfit);
    this.outfitsService.update(outfit);
    }


    refreshClothingContext() {
        this.manualOutfitClothing = []
    }

    public setGetByOption(getByOption: string) {
        this.getByOption = getByOption;
        this.setClothingSignalForSubModal();
    }

    public setClothingSignalForSubModal() {
        if (this.getByOption==='all'){
            this.clothingService.getAllByUserLongPagination();
        } else if (this.getByOption === 'favorite'){
            this.clothingService.getAllFavoritesByUserLongPagination();
            console.log(this.getByOption)
        } else {
            this.clothingService.getAllByTypeLongPagination(this.getByOption);
        }
    }

    public setClotingAddToOutfit(clothing: IClothing[]) {
        console.log('manual clothing to add: ', clothing);
        this.manualOutfitClothing = clothing;
    }
}
