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

    }

    getAllByUser() {

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
