import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IClothing} from "../../../interfaces";

@Component({
  selector: 'app-clothing-list',
  standalone: true,
  imports: [

  ],
  templateUrl: './clothing-list.component.html',
  styleUrl: './clothing-list.component.scss'
})
export class ClothingListComponent {
  @Input() clothing: IClothing[] = [];
  @Output() callModalAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
  @Output() callDeleteAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();

  isFav: boolean = false;

  toggleIsFav() {
    this.isFav = !this.isFav;
  }
}
