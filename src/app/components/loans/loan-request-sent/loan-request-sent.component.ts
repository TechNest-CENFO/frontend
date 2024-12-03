import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IClothing, ILoan, IUser } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';
import { LoansService } from '../../../services/loans.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-request-sent',
  standalone: true,
  imports: [CommonModule],
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
  

  ngOnInit(): void {

    if (this.loan) {
      this.associatedUser = this.loan.lenderUser;
    }
  }


  ngOnChanges(){
    // if (this.loan.clothing) {
    //   this.associatedUser = this.loan.lenderUser;      
    // }

    if (this.loan) {
      this.associatedUser = this.loan.lenderUser;
     
    }
  }
}