import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, SimpleChanges} from '@angular/core';
import {IClothing, IOrder, IOutfit} from "../../../interfaces";
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UploadService} from '../../../services/upload.service';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import Aos from "aos";
import {LottieComponentComponent} from "../../../pages/lottie-component/lottie-component.component";
import {OutfitsComponent} from '../../../pages/outfits/outfits.component';

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

    outfitsRandom?: IClothing[] = [];

    outfitByCategory?: IOutfit;

    constructor(private _uploadService: UploadService,
                private _outfitsComponent: OutfitsComponent
    ) {
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

    getOutfit(){
        if(this.outfitCreationOption==='random') {
            console.log(this.outfitCreationOption);
            this.getOutfitRandom();
        } else {
            console.log(this.outfitCreationOption);
            this.generateOutfitByCategory(this.outfitCreationOption);
        }
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

    public getRandomItem<T>(array: T[]): T {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    public generateOutfitByCategory(categoryName: string) {
        this._outfitsComponent.clothingService.getAllByUser();
        this.manualClothing = this._outfitsComponent.clothingService.clothing$()
        const filteredByCategory: IClothing[] = this.manualClothing!.filter(c =>
            c.categories?.some(cat => cat.name === categoryName)
        );
        console.log(filteredByCategory);
        if (filteredByCategory.length) {
            const byUpper: IClothing[] = filteredByCategory.filter(c => c.clothingType?.type == 'SUPERIOR');
            const byBottom: IClothing[] = filteredByCategory.filter(c => c.clothingType?.type == 'INFERIOR');
            const byOuter: IClothing[] = filteredByCategory.filter(c => c.clothingType?.type == 'ABRIGO');
            const byFootwear: IClothing[] = filteredByCategory.filter(c => c.clothingType?.type == 'CALZADO');
            const byFullBody: IClothing[] = filteredByCategory.filter(c => c.clothingType?.type == 'CUERPO_COMPLETO');
            const byAccessory: IClothing[] = filteredByCategory.filter(c => c.clothingType?.type == 'ACCESORIO');

            const values: number[] = [1,2];

            const outfit:IOutfit={
                name: '',
                user: this._outfitsComponent.AuthService.getUser()!,
                clothing: []
            }

            if (byUpper.length && byBottom.length && byFootwear.length) {
                if (byFullBody.length) {
                    if (this.getRandomItem(values) == 1) {
                        outfit.clothing.push(this.getRandomItem(byBottom));
                    } else {
                        outfit.clothing.push(this.getRandomItem(byFullBody));
                    }
                    if (this.getRandomItem(values) == 1) {
                        outfit.clothing.push(this.getRandomItem(byUpper));
                    } else {
                        if (!outfit.clothing.some(c=> c.clothingType?.type == 'CUERPO_COMPLETO')){
                            outfit.clothing.push(this.getRandomItem(byFullBody));
                        }
                    }
                } else {
                    outfit.clothing.push(this.getRandomItem(byBottom));
                }
                outfit.clothing.push(this.getRandomItem(byFootwear));
            }


            this.outfitByCategory = outfit;
            console.log(this.outfitByCategory)
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
            name: this.outfitsForm.controls['name'].value,
            category: {
                name: this.reformat(this.outfitCategory)
            }
        }
        if (this.manualClothing?.length) {
            outfit.clothing = this.manualClothing;
        }

        if (this.outfitsRandom?.length) {
            outfit.clothing = this.outfitsRandom;
        }

        if (this.outfitByCategory?.clothing.length) {
            outfit.clothing = this.outfitByCategory.clothing;
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
