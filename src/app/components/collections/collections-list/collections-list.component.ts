import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {ICollection, IOutfit} from '../../../interfaces';
import Aos from 'aos';
import {CollectionsCardComponent} from '../collections-card/collections-card.component';

@Component({
    selector: 'app-collections-list',
    standalone: true,
    imports: [CollectionsCardComponent],
    templateUrl: './collections-list.component.html',
    styleUrl: './collections-list.component.scss'
})
export class CollectionsListComponent {
    @Output() callModalAction = new EventEmitter<ICollection>();
    @Output() callDeleteAction = new EventEmitter<ICollection>();
    @Input() collections!: ICollection[];
    @Input() outfits!: IOutfit[];

    ngOnInit(): void {
        Aos.init()
    }

    public callEdition($event:ICollection) {
        this.callModalAction.emit($event)
    }
}
