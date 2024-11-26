import { OutfitsService } from './../../../services/outfits.service';
import { Component, EventEmitter, Inject, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { ModalService } from '../../../services/modal.service';
import { UploadService } from '../../../services/upload.service';
import { IClothing, IOutfit } from '../../../interfaces';
import { LottieComponentComponent } from "../../../pages/lottie-component/lottie-component.component";
import { OutfitsComponent } from '../../../pages/outfits/outfits.component';
import { idText } from 'typescript';

@Component({
  selector: 'app-outfits-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxDropzoneModule, LottieComponentComponent],
  templateUrl: './outfits-edit.component.html',
  styleUrl: './outfits-edit.component.scss',
  providers: [ModalService, UploadService]
})
export class OutfitsEditComponent  {
  private OutfitsService: OutfitsService = Inject(OutfitsService);
  private modalService: ModalService = Inject(ModalService);

  @Input() outfitsEditForm!: FormGroup;
  @Input() manualClothing?: IClothing[];
  @Input() outfit!: IOutfit;
  @Output() callSaveMethod = new EventEmitter<IOutfit>();
  @Output() callUpdateMethod = new EventEmitter<IOutfit>();
  @Output() callSetIsAddClothingModalActive = new EventEmitter<unknown>();
  @Output() refreshClothingContext = new EventEmitter<void>();

  files: File[] = [];
  clothing: IClothing[] = [];
  previewImage: string = 'lottie';
  outfitCategory: string = 'Categoría';
  outfitCreationOption: string = 'manual';
  dropdownOptionSelected: string = 'Estilo';
  outfitsRandom?:IClothing[] = [];
      lottie = {
        path: './assets/lottie/emptyOutfit.json',
        loop: true,
        autoplay: true
    };

      constructor(private fb: FormBuilder,
        private outfitsService: OutfitsService
    ) {}

  

  callUpdate() {
    const formValue = this.outfitsEditForm.value;
    console.log("Actualizando outfit con ID:", formValue.id, "con los siguientes datos:", formValue);

    const outfitData: IOutfit = {
      id: this.outfit.id,
      name: formValue.name,
      category: {
        id: 1,
        name: this.reformat(formValue.category)
      },
      imageUrl: formValue.imageUrl,
      clothing: this.manualClothing || [],
      isFavorite: false,
      isPublic: false,
    };
    this.outfitsService.update(outfitData);
    this.modalService.closeAll();
    console.log("Outfit actualizado con éxito con los siguientes datos:", outfitData);

  }

  setOutfitCategory(category: string): void {
    this.outfitCategory = this.capitalizeAndReplace(category);
    this.outfitsEditForm.patchValue({ category });
  }

  callSetIsAddClothingModal(): void {
    this.callSetIsAddClothingModalActive.emit();
  }

  private capitalizeAndReplace(text: string): string {
    if (!text) return '';
    const formattedText = text.replace(/_/g, ' ');
    return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
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

  setOutfitCreationOption(outfitCreationOption: string) {
    this.outfitCreationOption = outfitCreationOption;
    if (this.outfitCreationOption === 'manual' || this.outfitCreationOption === 'random') {
        this.dropdownOptionSelected = 'Estilo';
    } else {
        this.dropdownOptionSelected = this.capitalizeAndReplace(outfitCreationOption);
    }
    this.refreshClothingContext.emit();
    this.previewImage = 'lottie';
    }

        public loadPreview(imageUrl: string) {
        this.previewImage = imageUrl;
    }

    ngOnInit(): void {

      if(this.outfit){
          this.initializeForm();
      }
    }

    private initializeForm(): void {
        this.outfitsEditForm = this.fb.group({
          id:this.outfit.id,
          name: ['', Validators.required],
          category: ['', Validators.required],
          imageUrl: ['', Validators.required]
        });
      }

      

}