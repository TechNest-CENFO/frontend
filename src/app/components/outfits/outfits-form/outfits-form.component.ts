import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IOutfit} from "../../../interfaces";

@Component({
  selector: 'app-outfits-form',
  standalone: true,
  imports: [],
  templateUrl: './outfits-form.component.html',
  styleUrl: './outfits-form.component.scss'
})
export class OutfitsFormComponent {
    @Input() outfitsForm!: any;
    @Output() callSaveMethod = new EventEmitter<IOutfit>();

}
