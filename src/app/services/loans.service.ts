import {inject, Injectable, signal} from '@angular/core';
import {BaseService} from './base-service';
import {IClothing, ILoan, IResponse, ISearch} from '../interfaces';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {NotyfService} from "./notyf.service";

@Injectable({
    providedIn: 'root'
})
export class LoansService extends BaseService<IClothing>{

    protected override source: string = 'loan';
    private clothingListSignal = signal<IClothing[]>([]);
    private loanListSignal = signal<ILoan[]>([]);


    get clothing$() {
        return this.clothingListSignal;
    }

    get loan$() {
        return this.loanListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 8
    }

    public searchExtended: ISearch = {
        page: 1,
        size: 40
    }

    public totalItems: any = [];
    private authService: AuthService = inject(AuthService);
    private notyfService: NotyfService = inject(NotyfService);


    getAll(): Observable<IResponse<IClothing[]>> {
        return this.findAllTypes();

    }

    ngOnInit() {
        this.getAll();
        this.getAllPublicClothing();
        this.getRequestsSent();
        this.getRequestsReceived();
    }

    getAllByUser() {
        this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/clothing`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }
  


    requestClothingItem(loan : ILoan) {
        this.http.post(`loan/request`, loan).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
           //     this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.loanListSignal.set(response.data);
                this.notyfService.success('Se ha solicitado la prenda exitosamente.')
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al solicitar la prenda.')
            }
        });
    }


    getAllPublicClothing() {
        this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}/public`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }

    getMyRelatedLoans() {
        this.findAllWithParamsAndCustomSource(`related-loans`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.loanListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }

    getRequestsSent() {
        const params = {
            page: this.search.page,
            size: this.search.size,
            loanerId: this.authService.getUser()?.id
        };

        this.findAllWithParamsAndCustomSource(`requests-sent`, params).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }


    getRequestsReceived() {
        const params = {
            page: this.search.page,
            size: this.search.size,
            lenderId: this.authService.getUser()?.id
        };
    
        this.findAllWithParamsAndCustomSource(`requests-received`, params).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
                this.loanListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargar tus prendas.')
            }
        });
    }


    getMyLoans() {
        this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}/public`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }


    getMyLends() {
        this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}/public`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }


    getLoans() {
        this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}/loan/all`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.clothingListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
            }
        });
    }

    setItemAsBorrowed(loan: ILoan){
        this.http.patch(`loan/approval`, loan).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.loanListSignal.set(response.data);
                if(loan.itemBorrowed){
                    this.notyfService.success('Se ha aceptado el préstamo exitosamente.')
                }else{
                    this.notyfService.success('Se ha denegado el préstamo exitosamente.')
                }
            },
            error: (err: any) => {
                console.error('error', err);
                if(loan.itemBorrowed){
                    this.notyfService.error('Ha ocurrido un error al aceptar el préstamo.')
                }else{
                    this.notyfService.error('Ha ocurrido un error al denegar el préstamo.')
                }
            }
        });
    }
    
      
}
