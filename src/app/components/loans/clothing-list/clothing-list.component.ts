import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IClothing} from "../../../interfaces";
import {ClothingCardComponent} from "../clothing-card/clothing-card.component";
import * as Aos from 'aos';

@Component({
  selector: 'app-clothing-list',
  standalone: true,
    imports: [
        ClothingCardComponent

    ],
  templateUrl: './clothing-list.component.html',
  styleUrl: './clothing-list.component.scss'
})
export class ClothingListComponent {
  @Input() clothing: IClothing[] = [];
  @Output() callModalAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
  @Output() callDeleteAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
  @Output() callSetIsFav = new EventEmitter<IClothing>();

  ngOnInit(): void {
    Aos.init()
  }

  public triggerCallSetIdFav(clothing: IClothing): void {
    this.callSetIsFav.emit(clothing);
  }

  protected readonly event = event;
}
