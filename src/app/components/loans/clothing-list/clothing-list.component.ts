import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IClothing} from "../../../interfaces";
import {ClothingCardComponent} from "../clothing-card/clothing-card.component";
import { LoanApprovalComponent } from '../loan-approval/loan-approval.component';
import * as Aos from 'aos';

@Component({
  selector: 'app-clothing-list',
  standalone: true,
    imports: [
        ClothingCardComponent,
        LoanApprovalComponent
    ],
  templateUrl: './clothing-list.component.html',
  styleUrl: './clothing-list.component.scss'
})
export class ClothingListComponent {
  @Input() clothing: IClothing[] = [];
  @Output() callSetIsFav = new EventEmitter<IClothing>();
  @Input() type: string = '';

  ngOnInit(): void {
    Aos.init()
  }

  public triggerCallSetIdFav(clothing: IClothing): void {
    this.callSetIsFav.emit(clothing);
  }

  protected readonly event = event;
}
