import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IClothing, IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";
import { ModalComponent } from '../../modal/modal.component';
import { ModalService } from '../../../services/modal.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ClothingService } from '../../../services/clothing.service';

@Component({
    selector: 'app-recommendation-card',
    standalone: true,
    imports: [ModalComponent, CommonModule, NgOptimizedImage],
    templateUrl: './recommendation-card.component.html',
    styleUrls: ['./recommendation-card.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendationCardComponent implements OnInit {
    @Input() outfit!: IOutfit;
    @Input() clothing!: IClothing[];
    @Output() callSetIsFavorite: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callSetIsPublic: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callEditAction: EventEmitter<IOutfit> = new EventEmitter<IOutfit>();

    public modalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    public clothingService: ClothingService = inject(ClothingService);

    isAddClothingModalActive: boolean = false;
    manualOutfitClothing: IClothing[] = [];
    getByOption: string = 'all';

    constructor(private outfitsService: OutfitsService) {}

    ngOnInit() {
        this.getTrendingOutfits();
    }

    getTrendingOutfits() {
        this.outfitsService.getTrendigOutfits();
    }
}