import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IClothing, IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";
import { ModalComponent } from '../../modal/modal.component';
import { ConfirmationFormOutfitsComponent } from "../confirmation-form-outfits/confirmation-form-outfits.component";
import { ModalService } from '../../../services/modal.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OutfitsEditComponent } from "../outfits-edit/outfits-edit.component";
import { AuthService } from '../../../services/auth.service';
import { ClothingService } from '../../../services/clothing.service';
import { OutfitsAddClothingFormComponent } from '../outfits-form/outfits-add-clothing-form/outfits-add-clothing-form.component';

@Component({
    selector: 'app-outfits-card',
    standalone: true,
    imports: [ModalComponent, ConfirmationFormOutfitsComponent, CommonModule, OutfitsEditComponent, NgOptimizedImage, OutfitsAddClothingFormComponent],
    templateUrl: './outfits-card.component.html',
    styleUrls: ['./outfits-card.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OutfitsCardComponent implements OnInit {
    @Input() outfit!: IOutfit;
    @Output() callSetIsFavorite: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callSetIsPublic: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callEditAction: EventEmitter<IOutfit> = new EventEmitter<IOutfit>();
    public modalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    public clothingService: ClothingService = inject(ClothingService);

    onEdit() {
        this.callEditAction.emit(this.outfit);
    }

    constructor(private outfitsService: OutfitsService) {
    }
    isAddClothingModalActive: boolean = false;
    manualOutfitClothing: IClothing[] = [];
    getByOption: string = 'all';

    ngOnInit() {
        console.log('estado: ', this.outfit);
    }

    toggleIsFav() {
        this.outfit.isFavorite = !this.outfit.isFavorite;
        this.callSetIsFavorite.emit(this.outfit);
    }

    toggleIsPublic(): void {
        this.outfit.isPublic = !this.outfit.isPublic;
        console.log('Nuevo estado de isPublic:', this.outfit.isPublic);
        this.callSetIsPublic.emit(this.outfit);
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
