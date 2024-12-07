import { Component, inject, Input, OnInit } from '@angular/core';
import { IClothing, IClothingType, ILoan, IUser } from '../../../interfaces';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { UploadService } from '../../../services/upload.service';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ClothingService } from '../../../services/clothing.service';
import { ModalService } from '../../../services/modal.service';
import { LoansService } from '../../../services/loans.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-clothing-edit',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
  ],
  providers: [UploadService],
  templateUrl: './clothing-edit.component.html',
  styleUrl: './clothing-edit.component.scss'
})
export class ClothingEditComponent implements OnInit {
  private _uploadService: UploadService = inject(UploadService);
  private clothingService: ClothingService = inject(ClothingService)
  private modalService: ModalService = inject(ModalService)
  private loanService: LoansService = inject(LoansService);
  private authService: AuthService = inject(AuthService);
  public fb: FormBuilder = inject(FormBuilder);

  @Input() clothingEditForm!: FormGroup;
  @Input() vclothingType: IClothingType[]=[];
  @Input() clothing!: IClothing;
  @Input() disabled: boolean = true;

  associatedUser?: IUser;
  uniqueTypes: string[] = [];
  filteredItems: string[] = [];
  selectedType: string = '';
  selectedName:string = '';
  selectedSubType:string='';
  uniqueSubTypes: string[] = [];
  uniqueNames: string[] = [];
  uniqueId: number = 0;
  isImageUpdated: boolean = false;
  clothingTypeData: IClothingType[] = [];

  callSave() {
    this.uploadImage();
  }

  private callSaveClothing(): void {
    const formValue = this.clothingEditForm.value;

    const clothingData: IClothing = {
      id: this.clothing.id,
      name: formValue.name,
      imageUrl: formValue.imageUrl,
      season: formValue.season,
      color: formValue.color,
      clothingType: ({
        id: this.uniqueId,
      }),
    };
    this.clothingService.update(clothingData);
    this.modalService.closeAll();
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
    this.uniqueTypes = [...new Set(this.vclothingType.map(item => item.type).filter((type): type is string => type !== undefined))];

    if (this.clothing) {
      this.initializeForm();
      this.associatedUser = this.clothing.user;
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

  ngOnChanges(): void {
    if (this.clothing) {
      this.initializeDropdowns();
    }
  }

  private initializeDropdowns(): void {
    this.uniqueTypes = [...new Set(this.vclothingType.map(item => item.type).filter((type): type is string => type !== undefined))];
    this.uniqueSubTypes = [];
    this.uniqueNames = [];
    const firstItemWithId = this.vclothingType.find(item => item.id !== undefined);
    this.uniqueId = firstItemWithId?.id || 0;
  }


  private initializeForm(): void {
    this.clothingEditForm = this.fb.group({
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
    if(this.files.length > 0 && this.isImageUpdated){
      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'technest-preset');
      data.append('cloud_name', 'dklipon9i');
      //sube la imagen a Cloudinary
      this._uploadService.uploadImage(data).subscribe(async (response) => {
        if (response) {
          //Guarda la prenda con el seteo de la imagen
          this.clothingEditForm.patchValue({
            imageUrl: response.url
          });
          await this.callSaveClothing();
        }
      });
    }else{
      this.callSaveClothing();
    }
  }


  onSelect(event: any){
    if(this.files.length >= 0){
      this.onRemove(event);
    }
    this.files.push(...event.addedFiles);
    this.isImageUpdated = true;
  }


  onRemove(event: any){
    this.files.splice(this.files.indexOf(event), 1);
  }


  requestClothingItem(){
   let loan: ILoan =   {
      lenderScore: 4,
      loanerScore: 5,
      clothing: {
        id: this.clothing.id,
        name: this.clothing.name,
        season: this.clothing.season,
        color: this.clothing.color
      },
      lenderUser: {
        id: this.clothing.user?.id
      },
      loanerUser: {
        id: this.authService.getUser()?.id
      },
      itemRequested: true,
      requestStatus: 'PENDING'
    }

    this.loanService.requestClothingItem(loan);
    this.modalService.closeAll();
  }
}
