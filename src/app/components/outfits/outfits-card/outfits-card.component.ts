import { Component, Input } from '@angular/core';
import { IOutfit } from "../../../interfaces";

@Component({
  selector: 'app-outfits-card',
  standalone: true,
  imports: [],
  templateUrl: './outfits-card.component.html',
  styleUrls: ['./outfits-card.component.scss']
})
export class OutfitsCardComponent {
    @Input() outfit!: IOutfit;

    isFav: boolean = false;

    toggleIsFav() {
        this.isFav = !this.isFav;
    }

    toggleIsPublic() {
        //this.outfit.isPublic = !this.outfit.isPublic
        
    }
}
