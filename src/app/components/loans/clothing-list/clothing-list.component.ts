import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IClothing, ILoan} from "../../../interfaces";
import {ClothingCardComponent} from "../clothing-card/clothing-card.component";
import { LoanApprovalComponent } from '../loan-approval/loan-approval.component';
import { LoanRequestSentComponent } from '../loan-request-sent/loan-request-sent.component';
import * as Aos from 'aos';

@Component({
  selector: 'app-clothing-list',
  standalone: true,
    imports: [
        ClothingCardComponent,
        LoanApprovalComponent,
        LoanRequestSentComponent
    ],
  templateUrl: './clothing-list.component.html',
  styleUrl: './clothing-list.component.scss'
})
export class ClothingListComponent {
  @Input() clothing?: IClothing[] = [];
  @Input() loan?: ILoan[] = [];

  @Output() callSetIsFav = new EventEmitter<IClothing>();
  @Input() type: string = '';

  ngOnInit(): void {
    Aos.init()
  }

  protected readonly event = event;
}
