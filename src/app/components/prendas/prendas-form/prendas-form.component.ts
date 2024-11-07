import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Input, Output, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { IClothing } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from "../../app-layout/elements/button/button.component";

@Component({
  selector: 'app-prendas-form',
  standalone: true,
  imports: [NgxDropzoneModule, ReactiveFormsModule, CommonModule, FormsModule, RouterLink, NgxDropzoneModule, ButtonComponent],
  //CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule
  templateUrl: './prendas-form.component.html',
  styleUrls: ['./prendas-form.component.scss']
})
export class PrendasFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() clothingForm!: FormGroup;
  @Output() callSaveMethod = new EventEmitter<IClothing>();

  callSave() {
    this.callSaveMethod.emit(this.clothingForm.value);
  }

  files: File[] = [];

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
