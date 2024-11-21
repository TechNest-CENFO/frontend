import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-form-outfits',
  standalone: true,
  templateUrl: './confirmation-form-outfits.component.html',
  styleUrls: ['./confirmation-form-outifts.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ConfirmationFormOutfitsComponent {
    @Input() confirmationForm!: FormGroup;
    @Output() closeModal = new EventEmitter<void>();
    @Output() onDeleteConfirmed = new EventEmitter<void>();

  deleteAccount() {
    this.onDeleteConfirmed.emit(); 
  }

  cancel() {
    this.closeModal.emit(); 
  }
  
}
