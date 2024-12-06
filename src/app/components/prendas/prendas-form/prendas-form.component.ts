import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    name: ['', Validators.required],
    isFavorite: [false, Validators.required],    // Asegurarse de que sea booleano
    isPublic: [false , Validators.required],      // Asegurarse de que sea booleano
    imageUrl: ['' , Validators.required],         // Cambiado para coincidir con el backend
    season: ['' , Validators.required],
    color: ['' , Validators.required],
    subType:['', Validators.required],
    clothingType: this.fb.group({
      id: [''],
      name: ['', Validators.required],
      subType: ['', Validators.required],
      type: ['', Validators.required]
      
    })
  });
  buttonDisabled:boolean = true;

  constructor(private _uploadService: UploadService,
  ) { }

  private checkFormValidity(): void {
    let clothingTypeValue = this.clothingForm.get('clothingType')?.value;
    let clothingSubTypeValue = this.clothingForm.get('clothingSubType')?.value;
    let clothingTypeNameValue = this.clothingForm.get('clothingTypeName')?.value;
    let isValidDrop =false;
   
  
    // Asegúrate de que la validación cubra todos los campos requeridos, por ejemplo:
    const isAllRequiredFieldsFilled = 
      this.clothingForm.get('name')?.valid &&
      this.clothingForm.get('season')?.valid;
        
      if ((!clothingTypeValue     || clothingTypeValue.trim() === '')   ||
          (!clothingSubTypeValue  || clothingSubTypeValue.trim() ==='') ||
          (!clothingTypeNameValue || clothingTypeNameValue.trim() ==='') 
      ) {
        isValidDrop = false;
      } else {
        isValidDrop = true;
      };
       
      
    


    const isImageSelected = this.files.length > 0;
  
    // El formulario es válido solo si todos los campos requeridos están llenos y la imagen está seleccionada
    let isValid = isAllRequiredFieldsFilled && isImageSelected && isValidDrop;
  
    // Habilitar o deshabilitar el botón basado en la validación completa
    this.buttonDisabled = !isValid;
    console.log("Botón habilitado: ", !this.buttonDisabled);
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
    const selectedType = this.clothingForm.get('clothingType')?.value;
    //Se filtran solo los elementos que tengan la categoría seleccionada
    this.filterItems(selectedType, "subType", "type");
  }

  callGetNames():void{
    const selectedSubType = this.clothingForm.get('clothingSubType')?.value;
    //Se filtran solo los elementos que tengan la categoría seleccionada
    this.filterItems(selectedSubType, "name", "subType");
  }

  callGetItem():void{
    const selectedName = this.clothingForm.get('clothingTypeName')?.value;
    //Se filtra por el nombre seleccionado para obtener el id
    this.filterItems(selectedName, "id", "name");
  }

  private filterItems(itemSelected: string, filter:string, field:keyof IClothingType)
   {
    this.checkFormValidity();
    let filteredItems = [];
    if(filter !== "id"){
      this.uniqueNames =[];
    }
    
    this.selectedSubType="";
    filteredItems = this.vclothingType.filter(item => item[field] === itemSelected);
    
    
    if (filter === "subType") {   
      this.uniqueSubTypes = [...new Set(filteredItems.map(item => item.subType).filter((subType): subType is string => subType !== undefined))];
      this.clothingForm.get('clothingSubType')?.setValue('');
      this.clothingForm.get('clothingTypeName')?.setValue('')
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
    this.clothingForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
     });
    this.checkFormValidity();
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