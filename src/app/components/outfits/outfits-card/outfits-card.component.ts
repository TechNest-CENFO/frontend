import {Component, Input} from '@angular/core';
import {IOutfit} from "../../../interfaces";

@Component({
  selector: 'app-outfits-card',
  standalone: true,
  imports: [],
  templateUrl: './outfits-card.component.html',
  styleUrl: './outfits-card.component.scss'
})
export class OutfitsCardComponent {
    @Input() outfit!: IOutfit;

}
