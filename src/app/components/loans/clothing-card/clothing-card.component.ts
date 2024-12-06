import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IClothing, IClothingType, IUser} from "../../../interfaces";
import {ModalService} from '../../../services/modal.service';
import {ModalComponent} from '../../modal/modal.component';
import {ClothingEditComponent} from '../clothing-edit/clothing-edit.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-clothing-card',
    standalone: true,
    imports: [
        ModalComponent,
        ClothingEditComponent,
        CommonModule
    ],
    templateUrl: './clothing-card.component.html',
    styleUrl: './clothing-card.component.scss'
})
export class ClothingCardComponent implements OnChanges{
    @Input() clothing!: IClothing;
    @Output() callEditAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
    public modalService: ModalService = inject(ModalService);
    associatedUser?: IUser; 

    clothingTypeData: IClothingType[] = [];


  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;

    ngOnChanges(){
            if (this.clothing.user) {
              this.associatedUser = this.clothing.user;
            }
    }


    rate(rating: number): void {
        this.selectedRating = rating;
      }
    
      hoverRating(rating: number): void {
        this.selectedRating = rating;
      }
}
