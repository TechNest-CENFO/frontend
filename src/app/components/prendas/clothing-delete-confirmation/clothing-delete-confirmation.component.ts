import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ClothingService } from '../../../services/clothing.service';
import { IClothing } from '../../../interfaces';
import { ReactiveFormsModule } from '@angular/forms';

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

    console.log(this.clothing)
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
