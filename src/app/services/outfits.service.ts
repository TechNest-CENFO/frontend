import {inject, Injectable, signal} from '@angular/core';
import {IOutfit, ISearch} from "../interfaces";
import {AuthService} from "./auth.service";
import {AlertService} from "./alert.service";
import {NotyfService} from "./notyf.service";
import {BaseService} from "./base-service";

@Injectable({
    providedIn: 'root'
})
export class OutfitsService extends BaseService<IOutfit> {

    protected override source: string = 'clothing';
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
    private alertService: AlertService = inject(AlertService);
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
}
