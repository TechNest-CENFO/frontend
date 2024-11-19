import {inject, Injectable, signal} from '@angular/core';
import {IOrder, IOutfit, ISearch} from "../interfaces";
import {AuthService} from "./auth.service";
import {AlertService} from "./alert.service";
import {NotyfService} from "./notyf.service";
import {BaseService} from "./base-service";

@Injectable({
    providedIn: 'root'
})
export class OutfitsService extends BaseService<IOutfit> {

    protected override source: string = 'outfit';
    private outfitListSignal = signal<IOutfit[]>([]);

    get outfit$() {
        return this.outfitListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 8
    }

    public totalItems: any = [];
    private authService: AuthService = inject(AuthService);
    private notyfService: NotyfService = inject(NotyfService);

    delete($event: IOutfit) {

    }

    getAllFavoritesByUser() {
      this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/outfit/favorites`, {
      page: this.search.page,
      size: this.search.size
    }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        this.outfitListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
        this.notyfService.error('Ha ocurrido un error al cargas tus outfits.')
      }
    });
    }

    getAllByUser() {
        this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}`, {
      page: this.search.page,
      size: this.search.size
    }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        this.outfitListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
        this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
      }
    });

    }

    getAllByType(getBy: string) {
        
    }

    getAll() {

    }

    save(outfit: IOutfit) {
        this.addCustomSource(`user/${this.authService.getUser()?.id}`, outfit).subscribe({
            next: (response: any) => {
                this.notyfService.success('¡Tu outfit ha sido creado con éxito!');
                this.getAllByUser();
            },
            error: (err: any) => {
                this.notyfService.error('Ha ocurrido un error al crear tu outfit.');
                console.error('error', err);
            }
        });
    }
}
