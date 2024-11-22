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
        this.OutfitsService.callDelete(outfit.id);
        this.closeModal();
    }

    closeModal(){
        this.modalService.closeAll();
    }
  
}

/*
@Component({
  selector: 'app-clothing-delete-confirmation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './clothing-delete-confirmation.component.html',
  styleUrl: './clothing-delete-confirmation.component.scss'
})
export class ClothingDeleteConfirmationComponent implements OnInit{
  @Input() clothing!: IClothing;
  @Input() deleteClothingConfirmationForm!: FormGroup;

  public clothingService: ClothingService = inject(ClothingService);
  public modalService: ModalService = inject(ModalService);

  constructor(private fb: FormBuilder) {
  }


  ngOnInit() {
    this.deleteClothingConfirmationForm = this.fb.group({});
  }


  handleDelete() {
    if (this.clothing) {
      const deleteClothingItem = {
        ...this.clothing,
        isClothingItemActive: false,
      };
      this.deleteClothingItem(deleteClothingItem);
    }
  }

  
  deleteClothingItem(clothing: IClothing) {
    this.clothingService.deleteClothingItem(clothing);
    this.closeModal();
  }

  
  closeModal() {
    this.modalService.closeAll();
  }
}

 */