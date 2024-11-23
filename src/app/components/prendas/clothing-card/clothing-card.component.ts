import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {IClothing, IClothingType} from "../../../interfaces";
import { ModalService } from '../../../services/modal.service';
import { ModalComponent } from '../../modal/modal.component';
import { ClothingEditComponent } from '../clothing-edit/clothing-edit.component';
import { ClothingDeleteConfirmationComponent } from '../clothing-delete-confirmation/clothing-delete-confirmation.component';
import { ClothingTypeService } from '../../../services/clothing-type.service';
@Component({
  selector: 'app-clothing-card',
  standalone: true,
  imports: [ModalComponent, ClothingEditComponent, ClothingDeleteConfirmationComponent],
  templateUrl: './clothing-card.component.html',
  styleUrl: './clothing-card.component.scss'
})
export class ClothingCardComponent {
  @Input() clothing!: IClothing;
  @Output() callEditAction: EventEmitter<IClothing> = new EventEmitter<IClothing>();
  public modalService: ModalService = inject(ModalService);
  public clothingTypeService: ClothingTypeService = inject(ClothingTypeService);
  clothingTypeData: IClothingType[] = []; // Almacenar los datos de los tipos de prendas

  isFav: boolean = false;
  toggleIsFav() {
    this.isFav = !this.isFav;
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
}
