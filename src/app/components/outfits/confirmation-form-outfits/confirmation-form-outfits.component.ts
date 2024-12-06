import { OutfitsService } from './../../../services/outfits.service';
import { IOutfit } from './../../../interfaces/index';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    @Input() outfit!: IOutfit;

    public modalService: ModalService = inject(ModalService);
    public OutfitsService: OutfitsService = inject(OutfitsService);

    constructor(private fb: FormBuilder) {
  }

    ngOnInit(){
        this.confirmationForm = new FormGroup({});
    }

    handleDelete(){
        if(this.outfit){
      const deleteOutfitItem = {
        ...this.outfit,
        isClothingItemActive: false,
      };
      this.deleteOutfitItem(deleteOutfitItem);
    }
    }

    deleteOutfitItem(outfit: IOutfit){
        this.OutfitsService.callDelete(outfit.id!);
        this.closeModal();
    }

    closeModal(){
        this.modalService.closeAll();
    }
  
}
