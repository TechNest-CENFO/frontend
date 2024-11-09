import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { IClothing } from '../../../interfaces';
import { PrendasComponent } from '../../../pages/prendas/prendas.component';


@Component({
  selector: 'app-prendas-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NgxDropzoneModule, ],
  //CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule
  templateUrl: './prendas-form.component.html',
  styleUrls: ['./prendas-form.component.scss']
})
export class PrendasFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() clothingForm!: FormGroup;
  @Input() clothingType: IClothing[]=[];
  uniqueTypes: string[] = [];
  filteredItems: string[] = [];
  @Output() callSaveMethod = new EventEmitter<IClothing>();
  selectedType: string = '';
  selectedName:string = '';
  selectedSubType:string='';
  uniqueSubTypes: string[] = [];
  uniqueNames: string[] = [];
  form = this.fb.group({
    name: [''],
    is_favorite: [false],
    is_public: [false],
    image_url: [''],
    type:[''],
    subType:['',{value:"", disabled:true}],
    material:[''],
    season:[''],
    color:['']
  })
  
  



  constructor(){};

  callSave() {
    this.callSaveMethod.emit(this.clothingForm.value);
  }

  callGetSubTypes():void{
    this.callGetNames();
    //Se filtran solo los elementos que tengan la categoría seleccionada
    this.filterItems(this.selectedType, "subType", "type");
  }
  callGetNames():void{
    //Se filtran solo los elementos que tengan la categoría seleccionada
    this.filterItems(this.selectedSubType, "name", "subType");
  }

  private filterItems(itemSelected: string, filter:string,field:keyof IClothing) {
    let filteredItems = [];
    this.uniqueNames =[];
    this.selectedSubType="";
    filteredItems = this.clothingType.filter(item => item[field] === itemSelected);
    
    // Extrae los subType de los elementos filtrados `${this.source}Type`)
    if(filter==="subType"){   
      this.uniqueSubTypes = [...new Set(filteredItems.map(item => item.subType))];
    }else{
      //filteredItems = this.clothingType.filter(item => item.subType === itemSelected);
      this.uniqueNames = [...new Set(filteredItems.map(item => item.name))];
      
    }   
    
  }



  ngOnInit(): void {       
    // Extraemos los tipos y eliminamos los duplicados
    this.uniqueTypes = [...new Set(this.clothingType.map(item => item.type))];
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
