import {Component, effect, inject, Injector, OnInit, runInInjectionContext} from '@angular/core';
import {PrendasFormComponent} from "../../components/loans/prendas-form/prendas-form.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {LoaderComponent} from '../../components/loader/loader.component';
import {IClothing, ILoan} from '../../interfaces';
import {NgClass} from "@angular/common";
import {ClothingListComponent} from "../../components/loans/clothing-list/clothing-list.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import { SearchComponent } from '../../components/search/search.component';
import { ClothingCardComponent } from '../../components/loans/clothing-card/clothing-card.component';
import { CommonModule } from '@angular/common'; 
import { LoansService } from '../../services/loans.service';
import { of, Subscription } from 'rxjs';

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
    public getBy: string = 'all';
    protected optionSelected: string = 'Tipo';
    searchTerm: string = '';
    filteredClothing: IClothing[] = [];
    clothing: IClothing[] = [];
    loan: ILoan[]= [];
    loanSubscription: Subscription | undefined;
    loanObj: ILoan = {}

    ngOnInit(): void {
        
        runInInjectionContext(this.injector, () => {
            effect(() => {
                this.loanSubscription = of(this.loansService.loan$()).subscribe((data) => {
                    this.loan = data;
                  });
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
           // this.loansService.getMyRelatedLoans();

        } else if (this.getBy == 'requestSent') {
            this.loansService.getRequestsSent();
            this.loan = this.loansService.loan$();
     
        }  else if (this.getBy == 'requestReceived') {
            this.loansService.getRequestsReceived();
            this.loan = this.loansService.loan$();
     
        } else if (this.getBy == 'loans') {
            this.loansService.getMyLoans();

        } else{
            this.loansService.getMyLends();
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
