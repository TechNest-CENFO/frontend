import { Component, inject, Input } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { ICollection } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-collections-edit',
  standalone: true,
  imports: [],
  templateUrl: './collections-edit.component.html',
  styleUrl: './collections-edit.component.scss'
})
export class CollectionsEditComponent {
  files: any;
  onRemove(_t85: any) {
  throw new Error('Method not implemented.');
  }
  onSelect($event: NgxDropzoneChangeEvent) {
  throw new Error('Method not implemented.');
  }
  setOutfitCreationOption(arg0: string) {
  throw new Error('Method not implemented.');
  }
  
  @Input() collection!: ICollection;
      public modalService: ModalService = inject(ModalService);
  
  
  
      
  
}
