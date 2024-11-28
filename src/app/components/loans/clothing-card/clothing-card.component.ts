import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {IClothing, IClothingType, IUser} from "../../../interfaces";
import {ModalService} from '../../../services/modal.service';
import {ModalComponent} from '../../modal/modal.component';
import {ClothingEditComponent} from '../clothing-edit/clothing-edit.component';
import {
    ClothingDeleteConfirmationComponent
} from '../clothing-delete-confirmation/clothing-delete-confirmation.component';
import {ClothingTypeService} from '../../../services/clothing-type.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-clothing-card',
    standalone: true,
    imports: [
        ModalComponent,
        ClothingEditComponent,
        ClothingDeleteConfirmationComponent,
        CommonModule
    ],
    templateUrl: './clothing-card.component.html',
    styleUrl: './clothing-card.component.scss'
})
export class ClothingCardComponent implements OnInit{
    @Input() clothing!: IClothing;
    @Output() callEditAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
    @Output() setIsFav: EventEmitter<IClothing> = new EventEmitter<IClothing>();
    public modalService: ModalService = inject(ModalService);
    associatedUser?: IUser; 

    public clothingTypeService: ClothingTypeService = inject(ClothingTypeService);
    clothingTypeData: IClothingType[] = [];

    ngOnInit(){
            this.isFav! = this.clothing.isFavorite!;

            if (this.clothing.user) {
              this.associatedUser = this.clothing.user;
            }
    }

    isFav?: boolean;

    toggleIsFav() {
        this.isFav = !this.isFav;
        this.callSetIsFav();
    }


    onEdit() {
        this.callEditAction.emit(this.clothing);
    }


    getAllTypeClothing(): void {
        this.clothingTypeService.getAll().subscribe({
            next: (response) => {
                this.clothingTypeData = response.data;
            },
            error: (err) => {
                err = "Ocurrió un error al cargar los datos.";
            }
        });
    }

    public callSetIsFav(): void {
        this.clothing.isFavorite = this.isFav;
        this.setIsFav.emit(this.clothing);
    }
}
