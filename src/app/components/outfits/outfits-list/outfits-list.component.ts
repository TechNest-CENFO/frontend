import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IOutfit} from "../../../interfaces";
import {ClothingCardComponent} from "../../prendas/clothing-card/clothing-card.component";
import {OutfitsCardComponent} from "../outfits-card/outfits-card.component";
import Aos from 'aos';
import {trigger} from "@angular/animations";

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
    @Output() callModalAction = new EventEmitter<IOutfit>();
    @Output() callDeleteAction = new EventEmitter<IOutfit>();
    @Input() outfits!: IOutfit[];
    @Output() callSetIsFavorite = new EventEmitter<IOutfit>();
    @Output() callSetIsPublic = new EventEmitter<IOutfit>();

    ngOnInit(): void {
    Aos.init()
  }

    protected readonly trigger = trigger;

    triggerSetIsFav($event: IOutfit) {
        this.callSetIsFavorite.emit($event);
    }

    triggerSetIsPublic($event: IOutfit) {
        this.callSetIsPublic.emit($event);
    }
}
