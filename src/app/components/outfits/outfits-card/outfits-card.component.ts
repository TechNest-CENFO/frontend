import { Component, inject, Input } from '@angular/core';
import { IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";
import { ModalComponent } from '../../modal/modal.component';
import { ConfirmationFormOutfitsComponent } from "../confirmation-form-outfits/confirmation-form-outfits.component";
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-outfits-card',
  standalone: true,
  imports: [ModalComponent, ConfirmationFormOutfitsComponent],
  templateUrl: './outfits-card.component.html',
  styleUrls: ['./outfits-card.component.scss']
})
export class OutfitsCardComponent {
    @Input() outfit!: IOutfit;
    public modalService: ModalService = inject(ModalService);

    isFav: boolean = false;

    constructor(private outfitsService: OutfitsService) {}

    toggleIsFav() {
        this.isFav = !this.isFav;
    }

    toggleIsPublic() {
        this.outfit.isPublic = !this.outfit.isPublic;
    }

    toggleDelete() {
    if (confirm('¿Estás seguro de que deseas eliminar este outfit?')) {
        this.outfitsService.callDelete(this.outfit.id);
    }
}
}


/*
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
    // Llamamos a getAll() y al Observable para obtener los datos
    this.clothingTypeService.getAll().subscribe({
        next: (response) => {
            // Accedemos a los datos y los almacenamos en la propiedad clothingData
            this.clothingTypeData = response.data;
        },
        error: (err) => {
            err = "Ocurrió un error al cargar los datos.";
        }
    });
  }
}

 */