import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IOutfit} from "../../../interfaces";
import {ClothingCardComponent} from "../../prendas/clothing-card/clothing-card.component";
import {OutfitsCardComponent} from "../outfits-card/outfits-card.component";

@Component({
    selector: 'app-outfits-list',
    standalone: true,
    imports: [
        ClothingCardComponent,
        OutfitsCardComponent
    ],
    templateUrl: './outfits-list.component.html',
    styleUrl: './outfits-list.component.scss'
})
export class OutfitsListComponent {
    @Output() callDeleteAction = new EventEmitter<IOutfit>();
    @Input() outfits!: IOutfit[];

}
