import { IOutfit } from './../../../interfaces/index';
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
    @Input() IOutfit!: IOutfit;
    @Output() closeModal = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    constructor(private modalService: ModalService) {}

    deleteOutfit() {
        this.delete.emit();
    }

  cancel() {
    this.closeModal.emit(); 
  }
  
}
