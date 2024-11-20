import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {IClothing, IOrder, IOutfit} from "../../../interfaces";
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UploadService} from '../../../services/upload.service';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import Aos from "aos";
import { OutfitsComponent } from '../../../pages/outfits/outfits.component';

@Component({
    selector: 'app-outfits-form',
    standalone: true,
    imports: [NgxDropzoneModule, ReactiveFormsModule, CommonModule, NgOptimizedImage],
    templateUrl: './outfits-form.component.html',
    styleUrl: './outfits-form.component.scss',
    providers: [UploadService]
})
export class OutfitsFormComponent {
    fb: FormBuilder = Inject(FormBuilder);
    @Input() outfitsForm!: FormGroup;
    @Input() manualClothing?: IClothing[];
    @Output() callSaveMethod = new EventEmitter<IOutfit>();
    
    @Output() callUpdateMethod = new EventEmitter<IOutfit>();
    @Output() callSetIsAddClothingModalActive = new EventEmitter<unknown>();

    files: File[] = [];

    //Para el tipo de creacion de outfit
    outfitCreationOption: string = 'manual';
    //Para modificar el texto dentro del dropdown
    dropdownOptionSelected: string = 'Estilo';


    //Estas variables son para la creacion de outfits manuales
    //Para modificar el texto dentro del dropdown de estilo (a la hora de crear outfits manuales)
    dropdownOptionSelectedManualOutfitStyle: string = 'Estilo';
    //Para guardar la data de las prendas seleccionadas
    clothing: IClothing[] = [];
    //Para guardar el url del la imagen a previsualizar
    previewImage?: string;
    outfitsRandom?:IClothing[] = [];

    constructor(private _uploadService: UploadService,
        private _outfitsComponent : OutfitsComponent
    ) {
    }

    ngOnInit() {
        Aos.init();
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
                this.outfitsForm.patchValue({
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

    setOutfitCreationOption(outfitCreationOption: string) {
        this.outfitCreationOption = outfitCreationOption;
        if (this.outfitCreationOption === 'manual' || this.outfitCreationOption === 'random') {
            this.dropdownOptionSelected = 'Estilo';
        } else {
            this.dropdownOptionSelected = this.capitalizeAndReplace(outfitCreationOption);
        }
    }

    capitalizeAndReplace(text: string): string {
        if (!text) return '';
        const formattedText = text.replace(/_/g, ' ');
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    
    async getOutfitRandom() {
        try {
            // Esperamos a que la promesa devuelta por callGetOutfitByUserRandom se resuelva
            this.outfitsRandom = await this._outfitsComponent.callGetOutfitByUserRandom(); 
            console.log("Outfits capturados:", this.outfitsRandom);
            // Ahora puedes usar la variable `outfits` que contiene la lista de outfits
        } catch (error) {
            console.error("Error al obtener los outfits", error);
        }
    }


        
    callSetIsAddClothingModal() {

        this.callSetIsAddClothingModalActive.emit();

    }

    public loadPreview(imageUrl: string) {
        this.previewImage = imageUrl;
    }

    callSave() {
        let outfit: IOutfit = {
            clothing: [],
            user: {},
            name: this.outfitsForm.controls['name'].value
        }
        if(this.manualClothing?.length) {
            outfit.clothing = this.manualClothing;
        }
        if(this.outfitsRandom?.length) {
            outfit.clothing = this.outfitsRandom;
        }
        if(outfit.id) {
            this.callUpdateMethod.emit(outfit);
        } else {
            this.callSaveMethod.emit(outfit);
        }
    }
}
