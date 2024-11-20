import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, SimpleChanges} from '@angular/core';
import {IClothing, IOrder, IOutfit} from "../../../interfaces";
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UploadService} from '../../../services/upload.service';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import Aos from "aos";
import {LottieComponentComponent} from "../../../pages/lottie-component/lottie-component.component";

@Component({
    selector: 'app-outfits-form',
    standalone: true,
    imports: [NgxDropzoneModule, ReactiveFormsModule, CommonModule, NgOptimizedImage, LottieComponentComponent],
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
    //Refrescar el contexto de prendas al cambiar el tipo de creacion
    @Output() refreshClothingContext = new EventEmitter<void>();

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
    previewImage: string = 'lottie';
    outfitCategory: string = 'Categoría';
    lottie = {
        path: './assets/lottie/emptyOutfit.json',
        loop: true,
        autoplay: true
    };

    constructor(private _uploadService: UploadService) {
    }

    ngOnInit() {
        Aos.init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.manualClothing?.length) {
            // @ts-ignore
            this.previewImage = this.manualClothing.at(0).imageUrl;
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
        let outfit: IOutfit = {
            clothing: [],
            user: {},
            name: this.outfitsForm.controls['name'].value,
            category: {
                name: this.reformat(this.outfitCategory)
            }
        }
        if (this.manualClothing?.length) {
            outfit.clothing = this.manualClothing;
        }
        if (outfit.id) {
            this.callUpdateMethod.emit(outfit);
        } else {
            this.callSaveMethod.emit(outfit);
        }
    }

    setOutfitCategory(category: string) {
        this.outfitCategory = this.capitalizeAndReplace(category);
        console.log(this.outfitCategory);
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
