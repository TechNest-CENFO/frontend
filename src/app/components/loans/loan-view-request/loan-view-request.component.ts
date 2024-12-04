import { Component, inject, Input } from '@angular/core';
import { ClothingService } from '../../../services/clothing.service';
import { ModalService } from '../../../services/modal.service';
import { LoansService } from '../../../services/loans.service';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { IClothing, IClothingType, ILoan, IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-view-request',
  standalone: true,
  imports: [ ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './loan-view-request.component.html',
  styleUrl: './loan-view-request.component.scss'
})
export class LoanViewRequestComponent {
  private modalService: ModalService = inject(ModalService)
  private loanService: LoansService = inject(LoansService);
  private authService: AuthService = inject(AuthService);
  public fb: FormBuilder = inject(FormBuilder);


  @Input() requestStatusForm!: FormGroup;
  @Input() loan!: ILoan;

  statusMessage: string = '';
  statusClass: string = '';
  associatedUser?: IUser;
  loanData: ILoan = {};
  clothingTypeData: IClothingType[] = [];


  callClose(){
    this.modalService.closeAll();
  }



  ngOnInit(): void {

    if (this.loan) {
      this.associatedUser = this.loan.lenderUser;
      this.loanData = this.loan;
      this. getStatus();
    }
  }

  getStatus(){
    if(this.loanData.requestStatus == 'APPROVED'){
      this.statusMessage = 'Aprobado'
      this.statusClass = 'text-success'
    }else if (this.loanData.requestStatus == 'PENDING'){
      this.statusMessage = 'Pendiente'
      this.statusClass = 'text-warning'
    }else if(this.loanData.requestStatus == 'REJECTED') {
      this.statusMessage = 'Rechazado'
      this.statusClass = 'text-danger'
    }
  }

}
