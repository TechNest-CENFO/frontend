import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {IOutfit} from "../../../interfaces";
import {OutfitsService} from "../../../services/outfits.service";
import {ModalComponent} from '../../modal/modal.component';
import {ConfirmationFormOutfitsComponent} from "../confirmation-form-outfits/confirmation-form-outfits.component";
import {ModalService} from '../../../services/modal.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {OutfitsEditComponent} from "../outfits-edit/outfits-edit.component";
import Swiper from "swiper";

@Component({
    selector: 'app-outfits-card',
    standalone: true,
    imports: [ModalComponent, ConfirmationFormOutfitsComponent, CommonModule, OutfitsEditComponent, NgOptimizedImage],
    templateUrl: './outfits-card.component.html',
    styleUrls: ['./outfits-card.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OutfitsCardComponent implements OnInit {
    @Input() outfit!: IOutfit;
    @Output() callSetIsFavorite: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callSetIsPublic: EventEmitter<IOutfit> = new EventEmitter();
    public modalService: ModalService = inject(ModalService);

    constructor(private outfitsService: OutfitsService) {
    }

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


    toggleDelete() {
        if (confirm('¿Estás seguro de que deseas eliminar este outfit?')) {
            this.outfitsService.callDelete(this.outfit.id!);
        }
    }
}
