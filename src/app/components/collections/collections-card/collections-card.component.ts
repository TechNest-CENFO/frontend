import { Component, inject, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { ICollection } from '../../../interfaces';
import { CollectionsService } from '../../../services/collections.service';
import { ModalComponent } from '../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { ConfirmationFormCollectionsComponent } from '../confirmation-form-collections/confirmation-form-collections.component';
import { CollectionsEditComponent } from '../collections-edit/collections-edit.component';
import {refCount} from "rxjs";

@Component({
  selector: 'app-collections-card',
  standalone: true,
  imports: [ModalComponent, ConfirmationFormCollectionsComponent, CommonModule, CollectionsEditComponent],
  templateUrl: './collections-card.component.html',
  styleUrl: './collections-card.component.scss'
})
export class CollectionsCardComponent {
  @Input() collection!: ICollection;
    public modalService: ModalService = inject(ModalService);

    isFav: boolean = false;

    colors: string [] = ['#c447a5', '#cd6969', '#55a6bb', '#c6bd58', '#60bb7b'];
    constructor(private collectionsService: CollectionsService) {}

     public getRandomItem<T>(array: T[]): T {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

}

