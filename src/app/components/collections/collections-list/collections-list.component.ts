import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICollection } from '../../../interfaces';
import Aos from 'aos';
import { CollectionsCardComponent } from '../collections-card/collections-card.component';

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

  ngOnInit(): void {
  Aos.init()
}
}
