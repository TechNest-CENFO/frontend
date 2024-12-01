import {Component, effect, inject, Injector, OnInit, runInInjectionContext} from '@angular/core';
import {PrendasFormComponent} from "../../components/loans/prendas-form/prendas-form.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {LoaderComponent} from '../../components/loader/loader.component';
import {IClothing} from '../../interfaces';
import {NgClass} from "@angular/common";
import {ClothingListComponent} from "../../components/loans/clothing-list/clothing-list.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import { SearchComponent } from '../../components/search/search.component';
import { ClothingCardComponent } from '../../components/loans/clothing-card/clothing-card.component';
import { CommonModule } from '@angular/common'; 
import { LoansService } from '../../services/loans.service';

@Component({
    selector: 'app-prendas',
    standalone: true,
    imports: [
        PrendasFormComponent,
        ModalComponent,
        LoaderComponent,
        NgClass,
        ClothingListComponent,
        PaginationComponent,
        SearchComponent,
        ClothingCardComponent,
        CommonModule,
    ],
    templateUrl: './loans.component.html',
    styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
    public loansService: LoansService = inject(LoansService);
    private injector = inject(Injector);

    gridSelected: boolean = true;
    protected getBy: string = 'all';
    protected optionSelected: string = 'Tipo';
    searchTerm: string = '';
    filteredClothing: IClothing[] = [];
    clothing: IClothing[] = [];
    requestType: string = '';


    ngOnInit(): void {
        runInInjectionContext(this.injector, () => {
            effect(() => {
              this.clothing = this.loansService.clothing$();
              this.filteredClothing = [...this.clothing];
            });
          });
          this.callGet();
    }


      
    searchClothing(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.filteredClothing = [...this.clothing];
            return;
        }
    
        this.filteredClothing = this.clothing.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    

    onSearchTermChanged(searchTerm: string): void {
        this.filteredClothing = this.clothing.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
            );
    }


    callGet() {
        if (this.getBy == 'all') {
            this.loansService.getAllPublicClothing();
            this.requestType = 'all'
       //     this.optionSelected = this.capitalizeAndReplace(this.getBy);

        } else if (this.getBy == 'requests') {
            this.loansService.getMyRequests();
            this.requestType = 'requests'
      //      this.optionSelected = this.capitalizeAndReplace(this.getBy);
     
        } else if (this.getBy == 'loans') {
            this.loansService.getMyLoans();
             this.requestType = 'loans'
      //      this.optionSelected = this.capitalizeAndReplace(this.getBy);

        } else{
            this.loansService.getMyLends();
            this.requestType = 'lends'

      //      this.optionSelected = this.capitalizeAndReplace(this.getBy);

        }
    }


    capitalizeAndReplace(text: string): string {
        if (!text) return '';
        const formattedText = text.replace(/_/g, ' ');
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }


    toggleGridSelected() {
        this.gridSelected = !this.gridSelected;
    }


    setGetBy(type: string) {
        this.getBy = type;
        this.callGet();
    }
}
