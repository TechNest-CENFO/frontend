import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IOutfit} from "../../../interfaces";
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UploadService } from '../../../services/upload.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-outfits-form',
  standalone: true,
  imports: [NgxDropzoneModule, ReactiveFormsModule, CommonModule],
  templateUrl: './outfits-form.component.html',
  styleUrl: './outfits-form.component.scss',
  providers: [UploadService]
})
export class OutfitsFormComponent {
  @Input() outfitsForm!: FormGroup;
  @Output() callSaveMethod = new EventEmitter<IOutfit>();
  files: File[] = [];

  constructor(private _uploadService: UploadService,
  ) { }



  private uploadImage() {
    
    const file_data = this.files[0];
    const data = new FormData();
    data.append('file', file_data);
    data.append('upload_preset', 'technest-preset');
    data.append('cloud_name', 'dklipon9i');
    //sube la imagen a Cloudinary
    this._uploadService.uploadImage(data).subscribe(async (response) => {
      if (response) {
        //Guarda la prenda con el seteo de la imagen
        this.outfitsForm.patchValue({
          imageUrl: response.url
        });
        //await this.callSaveClothing();
      }
    });
  }

  onSelect(event: any){
    if(this.files.length >= 0){
      this.onRemove(event);
    }
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any){
    this.files.splice(this.files.indexOf(event), 1);
  }
}
