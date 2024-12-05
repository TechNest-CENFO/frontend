import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IClothing, IOutfit } from "../../../interfaces";
import { ModalComponent } from '../../modal/modal.component';
import { ModalService } from '../../../services/modal.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OutfitsService } from "../../../services/outfits.service";
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-recommendation-card',
    standalone: true,
    imports: [ModalComponent, CommonModule, NgOptimizedImage],
    templateUrl: './recommendation-card.component.html',
    styleUrls: ['./recommendation-card.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendationCardComponent implements OnInit {
    @Input() outfit: IOutfit[] = [];
    @Input() clothing: IClothing[] = []; 
    @Input() outfitTrendingData: IOutfit = {
        clothing: []
    }
    @Output() callSetIsFavorite: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callSetIsPublic: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callEditAction: EventEmitter<IOutfit> = new EventEmitter<IOutfit>();

    public modalService: ModalService = inject(ModalService);
    public authService: AuthService = inject(AuthService);

    constructor(private outfitsService: OutfitsService) {}

    ngOnInit(): void {
        console.log("outfit: ", this.outfit);
    }
}
