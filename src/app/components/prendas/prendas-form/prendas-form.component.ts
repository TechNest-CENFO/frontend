import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { IClothing, IClothingType } from '../../../interfaces';
import { PrendasComponent } from '../../../pages/prendas/prendas.component';


@Component({
  selector: 'app-prendas-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NgxDropzoneModule, ],
  //CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule
  templateUrl: './prendas-form.component.html',
  styleUrls: ['./prendas-form.component.scss']
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


  constructor(){}


callSave() {
  const formValue = this.clothingForm.value;

  // Convertir el formulario a la estructura deseada antes de emitir
  const clothingData: IClothing = {
    name: formValue.name,
    imageUrl: formValue.imageUrl,
    season: formValue.season,
    color: formValue.color,
    clothingType: {
      id: formValue.id,
    }
  };

  this.callSaveMethod.emit(clothingData);
  console.log(clothingData);
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
    
    // Extrae los subType de los elementos filtrados `${this.source}Type`)
        if (filter === "subType" && filteredItems !== undefined) {   
      this.uniqueSubTypes = [...new Set(filteredItems.map(item => item.subType).filter((subType): subType is string => subType !== undefined))];
    } else if (filter === "name") {     
      this.uniqueNames = [...new Set(filteredItems.map(item => item.name).filter((name): name is string => name !== undefined))];
    } else if (filter === "id") {
      console.log(this.vclothingType.filter(item => item.name === itemSelected));
      this.vclothingType.filter(item => item.name === itemSelected);
      if(filteredItems.length > 0){
        const uniqueId = filteredItems[0].id;
        this.clothingForm.patchValue({
          clothingType: {
            id: uniqueId,
          }
          
        })
        
        
      }

    } 
    
  }



  ngOnInit(): void {       
    // Extraemos los tipos y eliminamos los duplicados
    this.uniqueTypes = [...new Set(this.vclothingType.map(item => item.type).filter((type): type is string => type !== undefined))];
    console.log("tipo" + this.uniqueTypes);
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
