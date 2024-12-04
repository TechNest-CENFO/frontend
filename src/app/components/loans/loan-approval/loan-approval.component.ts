import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IClothing, IUser } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { LoansService } from '../../../services/loans.service';
import { ILoan } from '../../../interfaces';
import { ClothingEditComponent } from '../clothing-edit/clothing-edit.component';

@Component({
  selector: 'app-loan-approval',
  standalone: true,
  imports: [ ModalComponent, ClothingEditComponent,CommonModule],
  templateUrl: './loan-approval.component.html',
  styleUrl: './loan-approval.component.scss'
})
export class LoanApprovalComponent implements OnInit{

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
    if (this.loan) {
      this.associatedUser = this.loan.lenderUser;
    }
  }


  setBorrowItemStatus(status: string){
    let value: boolean
    if(status == 'approved'){
     value = true
    }else{
      value = false
    }

     let loan: ILoan ={
      id: 1,
      itemBorrowed: value,
      }

    this.loanService.setItemAsBorrowed(loan);
  }
}
