import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {IClothing, IOutfit} from "../../../../interfaces";
import {map} from "rxjs";
import {untagTsFile} from "@angular/compiler-cli/src/ngtsc/shims";

@Component({
    selector: 'app-collections-manual-outfit-card',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './collections-manual-outfit-card.component.html',
    styleUrl: './collections-manual-outfit-card.component.scss'
})
export class CollectionsManualOutfitCardComponent implements OnInit{
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
