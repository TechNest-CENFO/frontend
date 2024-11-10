import {AuthService} from './../../services/auth.service';

import {ClothingService} from './../../services/clothing.service';
import {Component, inject, ViewChild} from '@angular/core';
import {ModalService} from './../../services/modal.service';

import {PrendasFormComponent} from "../../components/prendas/prendas-form/prendas-form.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoaderComponent} from '../../components/loader/loader.component';
import {IClothing} from '../../interfaces';
import {NgClass} from "@angular/common";
import {ClothingListComponent} from "../../components/prendas/clothing-list/clothing-list.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";


@Component({
    selector: 'app-prendas',
    standalone: true,
    imports: [PrendasFormComponent, ModalComponent, LoaderComponent, NgClass, ClothingListComponent, PaginationComponent],
    templateUrl: './prendas.component.html',
    styleUrls: ['./prendas.component.scss']
})
export class PrendasComponent {
    public clothingService: ClothingService = inject(ClothingService);
    public ModalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);


    @ViewChild('AddClothingModal')
    public fb: FormBuilder = inject(FormBuilder);
    clothingForm = this.fb.group({
        name: [''],
        is_favorite: [false],
        is_public: [false],
        image_url: [''],
        type: [''],
        subType: [''],
        material: [''],
        season: [''],
        color: ['']

    });
    clothingData: IClothing[] = []; // Almacenar los datos de las prendas
    gridSelected: boolean = true;
    protected getBy: string = 'all';
    protected optionSelected: string = 'Tipo';

    constructor() {
    }

    saveClothing(clothing: IClothing) {
        this.clothingService.save(clothing);
        this.ModalService.closeAll();

    }

    getTypeClothing() {
        // Método para obtener los datos nuevamente si es necesario
        this.clothingService.getAll().subscribe({
            next: (response) => {
                this.clothingData = response.data;  // Puedes actualizar los datos aquí también
            },
            error: (err) => {
                console.error("Error en getTypeClothing", err);
            }
        });

    }

    ngOnInit(): void {
        // Llamamos a getAll() y al Observable para obtener los datos
        this.clothingService.getAll().subscribe({
            next: (response) => {
                // Accedemos a los datos y los almacenamos en la propiedad clothingData
                this.clothingData = response.data;
            },
            error: (err) => {
                err = "Ocurrió un error al cargar los datos.";
            }
        });
        this.callGet()
    }

    callGet() {
        if (this.getBy == 'all') {
            this.clothingService.getAllByUser();
            this.optionSelected = 'Tipo';

        } else if (this.getBy == 'favorite') {
            this.clothingService.getAllFavoritesByUser();
            this.optionSelected = 'Tipo';

        } else {
            this.clothingService.getAllByType(this.getBy);
            this.optionSelected = this.capitalizeAndReplace(this.getBy);
        }
    }

    //Función para formatear string
    capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    toggleGirdSelected() {
        this.gridSelected = !this.gridSelected;
    }

    setGetBy(type: string) {
        this.getBy = type;
        this.callGet();
    }
}
