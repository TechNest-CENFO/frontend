import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClothingCardComponent } from '../prendas/clothing-card/clothing-card.component';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ClothingCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchTerm: string = '';
  inputValue: string = '';

  @Output() searchTermChanged = new EventEmitter<string>();

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTermChanged.emit(query);
  }
}
