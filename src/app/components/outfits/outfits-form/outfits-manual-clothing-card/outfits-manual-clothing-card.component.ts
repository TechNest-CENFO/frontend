import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {IClothing, IOutfit} from "../../../../interfaces";
import {map} from "rxjs";
import {untagTsFile} from "@angular/compiler-cli/src/ngtsc/shims";

@Component({
    selector: 'app-outfits-manual-clothing-card',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './outfits-manual-clothing-card.component.html',
    styleUrl: './outfits-manual-clothing-card.component.scss'
})
export class OutfitsManualClothingCardComponent implements OnInit{
    @Input() item!: IClothing;
    @Input() selectedClothing!: IClothing[];
    @Output() clothingOutput = new EventEmitter<IClothing>();

    ngOnInit(){
        if(this.item.isSelectedInSubModal === undefined){
            this.item.isSelectedInSubModal = false;
        }
    }

    public toggleIsSelected() {
        this.item.isSelectedInSubModal = !this.item.isSelectedInSubModal;
        this.emitClothing();
    }

    public emitClothing() {
        if(this.item.isSelectedInSubModal){
            this.clothingOutput.emit(this.item);
        }
    };

}
