import {inject, Injectable, signal} from '@angular/core';
import {ICollection, IOutfit, IResponse, ISearch} from "../interfaces";
import {AuthService} from "./auth.service";
import {NotyfService} from "./notyf.service";
import {BaseService} from "./base-service";
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CollectionsService extends BaseService<ICollection> {

    protected override source: string = 'collection';
    private collectionListSignal = signal<ICollection[]>([]);
    ModalService: any;

    get collection$() {
        return this.collectionListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 4
    }

    public totalItems: any = [];
    private authService: AuthService = inject(AuthService);
    private notyfService: NotyfService = inject(NotyfService);

    getAllFavoritesByUser() {
        this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/collection/favorites`, {
            page: this.search.page,
            size: this.search.size
        }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.collectionListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargas tus collections.')
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
                this.collectionListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
                this.notyfService.error('Ha ocurrido un error al cargar tus colecciones.')
            }
        });

    }

    getAllByType(getBy: string) {

    }

    getAll() {

    }

    save(collection: ICollection) {
        this.addCustomSource(`user/${this.authService.getUser()?.id}`, collection).subscribe({
            next: (response: any) => {
                this.notyfService.success('¡Tu colección ha sido creada con éxito!');
                this.getAllByUser();
            },
            error: (err: any) => {
                this.notyfService.error('Ha ocurrido un error al crear tu colección.');
                console.error('error', err);
            }
        });
    }


    delete(collection: ICollection) {
        this.editCustomSource(`collection/${collection.id}`, {}).subscribe({
            next: (response: any) => {
                this.notyfService.success('La colección ha sido eliminada.');
                this.getAllByUser();
            },
            error: (err: any) => {
                this.notyfService.error('No se pudo eliminar la colección.');
            }
        });
    }
}
