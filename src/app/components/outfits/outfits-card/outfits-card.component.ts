import { Component, Input } from '@angular/core';
import { IOutfit } from "../../../interfaces";
import { OutfitsService } from "../../../services/outfits.service";
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-outfits-card',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './outfits-card.component.html',
  styleUrls: ['./outfits-card.component.scss']
})
export class OutfitsCardComponent {
    @Input() outfit!: IOutfit;

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
