import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IClothing, IClothingType } from '../../../interfaces';
import { ClothingCardComponent } from '../clothing-card/clothing-card.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { UploadService } from '../../../services/upload.service';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ClothingService } from '../../../services/clothing.service';
import { ConsoleLogger } from '@angular/compiler-cli';

@Component({
  selector: 'app-clothing-edit',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, FormsModule, NgxDropzoneModule],
  providers: [UploadService],
  templateUrl: './clothing-edit.component.html',
  styleUrl: './clothing-edit.component.scss'
})
export class ClothingEditComponent implements OnInit {
  //public fb: FormBuilder = inject(FormBuilder);
  private _uploadService: UploadService = inject(UploadService);
  private clothingService: ClothingService = inject(ClothingService)
  @Input() clothingForm!: FormGroup;
  @Input() vclothingType: IClothingType[]=[];
  @Input() clothing!: IClothing;

//  @Input() clothing: IClothing[] = [];


  uniqueTypes: string[] = [];
  filteredItems: string[] = [];
  @Output() callSaveMethod = new EventEmitter<IClothing>();
  selectedType: string = '';
  selectedName:string = '';
  selectedSubType:string='';
  uniqueSubTypes: string[] = [];
  uniqueNames: string[] = [];
  uniqueId: number = 0;


  constructor(private fb: FormBuilder) {
  }


  callSave() {
    this.uploadImage();
    
  }

  private callSaveClothing() {
    this.callForm(this.vclothingType[0]);

    this.callSaveMethod.emit(this.clothingForm.value);
    
  }

  callForm(clothingType: IClothingType): void {
    const formValue = this.clothingForm.value;
      

  // Convertir el formulario a la estructura deseada antes de emitir
    const clothingData: IClothing = {
      name: formValue.name,
      imageUrl: formValue.imageUrl,
      season: formValue.season,
      color: formValue.color,
      clothingType: {
        id: this.uniqueId,
      }
    };
   
    this.clothingForm.patchValue(clothingData);

  }


  callGetSubTypes():void{
    
    //Se filtran solo los elementos que tengan la categoría seleccionada
    this.filterItems(this.selectedType, "subType", "type");
  }

  callGetNames():void{
    //Se filtran solo los elementos que tengan la categoría seleccionada
    this.filterItems(this.selectedSubType, "name", "subType");
  }

  callGetItem():void{
    //Se filtra por el nombre seleccionado para obtener el id
    this.filterItems(this.selectedName, "id", "name");
  }

  private filterItems(itemSelected: string, filter:string, field:keyof IClothingType) {
    let filteredItems = [];
    if(filter !== "id"){
      this.uniqueNames =[];
    }
    
    this.selectedSubType="";
    filteredItems = this.vclothingType.filter(item => item[field] === itemSelected);
    
    
    if (filter === "subType") {   
      this.uniqueSubTypes = [...new Set(filteredItems.map(item => item.subType).filter((subType): subType is string => subType !== undefined))];
    } else if (filter === "name") {     
      this.uniqueNames = [...new Set(filteredItems.map(item => item.name).filter((name): name is string => name !== undefined))];
    } else if (filter === "id") {
      this.vclothingType.filter(item => item.name === itemSelected);
      if(filteredItems.length > 0){
        this.uniqueId = filteredItems[0].id !== undefined ? filteredItems[0].id : 0;
        this.vclothingType[0].id = this.uniqueId;
      }

    } 
    
  }



  ngOnInit(): void {   
    // Extraemos los tipos y eliminamos los duplicados
    this.uniqueTypes = [...new Set(this.vclothingType.map(item => item.type).filter((type): type is string => type !== undefined))];
    //console.log('UNIQUE TYPES: ', this.uniqueTypes);
    console.log('ARRAY VCLOTHING: ', this.vclothingType)

    if (this.clothing) {
      this.initializeForm();
      console.log('ON INIT ', this.clothing.clothingType?.name)
    }

    //carga la imagen que contiene actualmente clothing
    const defaultImageUrl = this.clothing?.imageUrl;
    if (defaultImageUrl) {
      fetch(defaultImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], '', { type: blob.type });
          this.files.push(file);
        });
    }
  }


  private initializeForm(): void {
    this.clothingForm = this.fb.group({
      clothingType: [this.clothing.clothingType?.type || ''],
      clothingSubType: [this.clothing.clothingType?.subType || ''],
      clothingTypeName: [this.clothing.clothingType?.name || ''],
      season: [this.clothing.season || ''],
      color: [this.clothing.color || ''],
      name: [this.clothing.name || ''],
      imageUrl: [this.clothing.imageUrl || ''],
    });
  }


  //Sección de Imagen
  files: File[] = [];
  
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
        this.clothingForm.patchValue({
          imageUrl: response.url
        });
        await this.callSaveClothing();
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