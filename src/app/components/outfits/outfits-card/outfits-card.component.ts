import { Component, inject, Input } from '@angular/core';
import { IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";
import { ModalComponent } from '../../modal/modal.component';
import { ConfirmationFormOutfitsComponent } from "../confirmation-form-outfits/confirmation-form-outfits.component";
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { OutfitsEditComponent } from "../outfits-edit/outfits-edit.component";

@Component({
  selector: 'app-outfits-card',
  standalone: true,
  imports: [ModalComponent, ConfirmationFormOutfitsComponent, CommonModule, OutfitsEditComponent],
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

    toggleIsPublic(): void {
        this.outfit.isPublic = !this.outfit.isPublic;
        // Aquí puedes añadir la lógica para actualizar la visibilidad en el servidor si es necesario.
        console.log(`El estado de visibilidad es ahora: ${this.outfit.isPublic ? 'Público' : 'Privado'}`);
    }


    toggleDelete() {
    if (confirm('¿Estás seguro de que deseas eliminar este outfit?')) {
        this.outfitsService.callDelete(this.outfit.id);
    }
}
}
