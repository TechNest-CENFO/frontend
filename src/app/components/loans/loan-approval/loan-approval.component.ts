import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IClothing, IClothingType, IUser } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { ClothingEditComponent } from '../clothing-edit/clothing-edit.component';

@Component({
  selector: 'app-loan-approval',
  standalone: true,
  imports: [ ModalComponent, ClothingEditComponent,       CommonModule],
  templateUrl: './loan-approval.component.html',
  styleUrl: './loan-approval.component.scss'
})
export class LoanApprovalComponent {

  @Input() clothing!: IClothing;
  @Output() callEditAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
  public modalService: ModalService = inject(ModalService);
  associatedUser?: IUser; 
  clothingTypeData: IClothingType[] = [];


  ngOnChanges(){
          if (this.clothing.user) {
            this.associatedUser = this.clothing.user;
          }

  }
}