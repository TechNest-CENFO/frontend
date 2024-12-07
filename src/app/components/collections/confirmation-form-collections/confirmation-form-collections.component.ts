import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { OutfitsService } from '../../../services/outfits.service';
import { ICollection, IOutfit } from '../../../interfaces';
import { CollectionsService } from '../../../services/collections.service';

@Component({
  selector: 'app-confirmation-form-collections',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './confirmation-form-collections.component.html',
  styleUrl: './confirmation-form-collections.component.scss'
})
export class ConfirmationFormCollectionsComponent {
  @Input() confirmationForm!: FormGroup;
  @Input() collection!: ICollection;

  public modalService: ModalService = inject(ModalService);
  public CollectionsService: CollectionsService = inject(CollectionsService);

  constructor(private fb: FormBuilder) {
}

  ngOnInit(){
      this.confirmationForm = new FormGroup({});
  }

  handleDelete(){
      if(this.collection){
    const deleteCollectionItem = {
      ...this.collection,
      isClothingItemActive: false,
    };
    this.deleteCollectionItem(deleteCollectionItem);
  }
  }

  deleteCollectionItem(collection: ICollection){
      this.CollectionsService.delete(collection);
      this.closeModal();
  }

  closeModal(){
      this.modalService.closeAll();
  }
}
