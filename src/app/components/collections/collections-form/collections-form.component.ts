import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IClothing, ICollection } from '../../../interfaces';
import { UploadService } from '../../../services/upload.service';
import Aos from 'aos';
import { CollectionsComponent } from '../../../pages/collections/collections.component';
import { CommonModule } from '@angular/common';
import {LottieComponentComponent} from "../../../pages/lottie-component/lottie-component.component";

@Component({
  selector: 'app-collections-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LottieComponentComponent ],
  templateUrl: './collections-form.component.html',
  styleUrl: './collections-form.component.scss'
})
export class CollectionsFormComponent {
  fb: FormBuilder = Inject(FormBuilder);
  @Input() collectionsForm!: FormGroup;

  @Input() manualCollection?: ICollection[];
  @Output() callSaveMethod = new EventEmitter<ICollection>();
  
  @Output() callUpdateMethod = new EventEmitter<ICollection>();
  @Output() callSetIsAddClothingModalActive = new EventEmitter<unknown>();
  //Refrescar el contexto de prendas al cambiar el tipo de creacion
  @Output() refreshClothingContext = new EventEmitter<void>();

  files: File[] = [];

  //Para el tipo de creacion de collection
  collectionCreationOption: string = 'manual';
  //Para modificar el texto dentro del dropdown
  dropdownOptionSelected: string = 'Estilo';


  //Estas variables son para la creacion de collections manuales
  //Para modificar el texto dentro del dropdown de estilo (a la hora de crear collection manuales)
  dropdownOptionSelectedManualOutfitStyle: string = 'Estilo';
  //Para guardar la data de las prendas seleccionadas
  clothing: IClothing[] = [];
  //Para guardar el url del la imagen a previsualizar
  previewImage: string = 'lottie';
  collectionCategory: string = 'Categoría';
  lottie = {
      path: './assets/lottie/emptyOutfit.json',
      loop: true,
      autoplay: true
  };

  collectionsRandom?:IClothing[] = [];

  constructor(private _uploadService: UploadService,
      private _collectionsComponent : CollectionsComponent
  ) {}

  ngOnInit() {
      Aos.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.manualCollection?.length) {
          // @ts-ignore
          this.previewImage = this.manualOutfit.at(0).imageUrl;
      }
  }

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
              this.collectionsForm.patchValue({
                  imageUrl: response.url
              });
              //await this.callSaveClothing();
          }
      });
  }

  onSelect(event: any) {
      if (this.files.length >= 0) {
          this.onRemove(event);
      }
      this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
      this.files.splice(this.files.indexOf(event), 1);
  }

  setCollectionCreationOption(collectionCreationOption: string) {
      this.collectionCreationOption = collectionCreationOption;
      if (this.collectionCreationOption === 'manual' || this.collectionCreationOption === 'random') {
          this.dropdownOptionSelected = 'Estilo';
      } else {
          this.dropdownOptionSelected = this.capitalizeAndReplace(collectionCreationOption);
      }
      this.refreshClothingContext.emit();
      this.previewImage = 'lottie';
  }

  capitalizeAndReplace(text: string): string {
      if (!text) return '';
      const formattedText = text.replace(/_/g, ' ');
      return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
  }
  


  callSetIsAddClothingModal() {

      this.callSetIsAddClothingModalActive.emit();

  }

  public loadPreview(imageUrl: string) {
      this.previewImage = imageUrl;
  }

  callSave() {
      let collection: ICollection = {
          outfit: [],
          user: {},
          name: this.collectionsForm.controls['name'].value,

      }
      if (this.manualCollection?.length) {
        //collection.outfit = this.manualCollection;
      }

      if(collection.id) {
          this.callUpdateMethod.emit(collection);
      } else {
          this.callSaveMethod.emit(collection);
      }
  }

  setCollectionCategory(category: string) {
      this.collectionCategory = this.capitalizeAndReplace(category);
      console.log(this.collectionCategory);
  }

  public reformat(text: string) {
      if (
          text !== 'Casual'
          && text !== 'Formal'
          && text !== 'Semi formal'
          && text !== 'Casual'
          && text !== 'Deportivo'
          && text !== 'Playero'
          && text !== 'Viaje'
          && text !== 'Festival'
          && text !== 'Callejero'
      ) {
          text = 'Otro';
      } else {
          text = text.replace(/ /g, '_');
      }
      return text.toUpperCase();
  }
}
