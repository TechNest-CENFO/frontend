import {Component, Input} from '@angular/core';
import {IClothing} from "../../../interfaces";

@Component({
  selector: 'app-clothing-card',
  standalone: true,
  imports: [],
  templateUrl: './clothing-card.component.html',
  styleUrl: './clothing-card.component.scss'
})
export class ClothingCardComponent {
  @Input() clothing!: IClothing;

    isFav: boolean = false;

  toggleIsFav() {
    this.isFav = !this.isFav;
  }
}
