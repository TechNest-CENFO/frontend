import { Component, inject, Input } from '@angular/core';
import { IOutfit } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-outfits-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxDropzoneModule ],
  templateUrl: './outfits-edit.component.html',
  styleUrl: './outfits-edit.component.scss',
  providers: [ModalService]
})
export class OutfitsEditComponent {
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
  @Input() outfit!: IOutfit;
    public modalService: ModalService = inject(ModalService);



    

}
