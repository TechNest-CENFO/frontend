import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";

import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ClothingService } from '../../../services/clothing.service';

@Component({
    selector: 'app-recommendation-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recommendation-card.component.html',
    styleUrls: ['./recommendation-card.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendationCardComponent implements OnInit {
    @Input() outfit!: IOutfit;
    @Output() callSetIsFavorite: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callSetIsPublic: EventEmitter<IOutfit> = new EventEmitter();
    @Output() callEditAction: EventEmitter<IOutfit> = new EventEmitter<IOutfit>();
    public modalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    public clothingService: ClothingService = inject(ClothingService);

    constructor(private outfitsService: OutfitsService) {
    }
    ngOnInit() {
        console.log('estado: ', this.outfit);
    }

    saveOutfit(outfit: IOutfit) {
        if (outfit.user) {
            outfit.user.id = this.AuthService.getUser()?.id;
        }
        console.log(outfit);
        this.outfitsService.save(outfit);
        
    }





}

  

