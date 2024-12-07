import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IClothing, IClothingType, ILoan, IUser } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';
import { LoansService } from '../../../services/loans.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { LoanViewRequestComponent } from '../loan-view-request/loan-view-request.component';

@Component({
  selector: 'app-loan-request-sent',
  standalone: true,
  imports: [CommonModule, LoanViewRequestComponent, ModalComponent],
  templateUrl: './loan-request-sent.component.html',
  styleUrl: './loan-request-sent.component.scss'
})
export class LoanRequestSentComponent {
  @Input() clothing!: IClothing;
  @Input() loan!: ILoan;

  @Output() callEditAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
  public modalService: ModalService = inject(ModalService);
  public loanService: LoansService = inject(LoansService);
  associatedUser?: IUser; 
  loans: ILoan[] = [];
  
  clothingTypeData: IClothingType[] = [];

  ngOnInit(): void {
    if (this.loan) {
      this.associatedUser = this.loan.lenderUser;
    }
  }


  ngOnChanges(){
    if (this.loan) {
      this.associatedUser = this.loan.lenderUser;
    }
  }
}