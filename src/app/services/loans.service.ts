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
        this.getMyRequests();
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

    getMyRequests() {
        this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}/my-requests`, {
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
      
}
