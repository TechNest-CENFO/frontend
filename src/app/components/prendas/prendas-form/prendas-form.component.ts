import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { IClothing, IClothingType } from '../../../interfaces';
import { UploadService } from '../../../services/upload.service';


@Component({
  selector: 'app-prendas-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NgxDropzoneModule],
  //CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule
  templateUrl: './prendas-form.component.html',
  styleUrls: ['./prendas-form.component.scss'],
  providers: [UploadService]
})
export class PrendasFormComponent implements OnInit{
  public fb: FormBuilder = inject(FormBuilder);
  @Input() clothingForm!: FormGroup;
  @Input() vclothingType: IClothingType[]=[];
  uniqueTypes: string[] = [];
  filteredItems: string[] = [];
  @Output() callSaveMethod = new EventEmitter<IClothing>();
  selectedType: string = '';
  selectedName:string = '';
  selectedSubType:string='';
  uniqueSubTypes: string[] = [];
  uniqueNames: string[] = [];
  uniqueId: number = 0;
  form = this.fb.group({
    id: [''],
    name: [''],
    isFavorite: [false],    // Asegurarse de que sea booleano
    isPublic: [false],      // Asegurarse de que sea booleano
    imageUrl: [''],         // Cambiado para coincidir con el backend
    season: [''],
    color: [''],
    subType:[''],
    clothingType: this.fb.group({
      id: [''],
      
    })
  });


  constructor(private _uploadService: UploadService,
  ) { }



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
    
  }

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