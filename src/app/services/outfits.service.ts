import {inject, Injectable, signal} from '@angular/core';
import {IOutfit, IResponse, ISearch} from "../interfaces";
import {AuthService} from "./auth.service";
import {AlertService} from "./alert.service";
import {NotyfService} from "./notyf.service";
import {BaseService} from "./base-service";
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OutfitsService extends BaseService<IOutfit> {

    protected override source: string = 'outfit';
    private outfitListSignal = signal<IOutfit[]>([]);
    ModalService: any;
    

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
                this.notyfService.error('Ha ocurrido un error al cargar tus outfits.')
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
                this.notyfService.error('Ha ocurrido un error al cargar tus outfits.')
            }
        });

    }

    getAllByType(getBy: string) {

    }

    getAll() {

    }

    getOutfitByUserRandom(temp:string): Observable<IResponse<any[]>> {
        if(temp === undefined || temp === ""){
            temp = '22';
        }
        console.log("outfitserviceRamdon", temp);  
	    return this.getCustomUrl(`${this.authService.getUser()?.id}/${temp}/random`);
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

    callDelete(outfitId: number) {
        this.editCustomSource(`${outfitId}/delete`, {}).subscribe({
            next: (response: any) => {
                this.notyfService.success('El outfit ha sido marcado como eliminado.');
                // Opcional: Actualizar la lista local después de eliminar
                this.getAllByUser();
            },
            error: (err: any) => {
                console.error('Error al marcar como eliminado el outfit:', err);
                this.notyfService.error('No se pudo eliminar el outfit.');
            }
        });
    }

    isFavorite(outfit: IOutfit, status: boolean, getBy?: string) {
        this.http.patch(`outfit/setIsFavorite/user/${this.authService.getUser()?.id}/item/${outfit.id}`, outfit).subscribe({
            next: (response: any) => {
                if (getBy == 'favorite') {
                    if (status) {
                        this.notyfService.success('Outfit agregado a favoritos');
                        this.getAllFavoritesByUser();
                    } else {
                        this.notyfService.success('El outfit ha sido retirado de favoritos');
                        this.getAllFavoritesByUser();
                    }
                } else {
                    if (status) {
                        this.notyfService.success('Outfit agregado a favoritos');
                    } else {
                        this.notyfService.success('El outfit ha sido retirado de favoritos');
                    }
                }
            },
            error: (err) => {
                if (status) {
                    this.notyfService.error('Ha ocurrido un error al agregar tu outfit a favoritos.');
                } else {
                    this.notyfService.error('Ha ocurrido un error al retirar tu outfit de favoritos.');
                }
            }
        })
    }

    isPublic(outfit: IOutfit, status: boolean) {
        this.http.patch(`outfit/setIsPublic/user/${this.authService.getUser()?.id}/item/${outfit.id}`, outfit).subscribe({
            next: (response: any) => {
                if (!status) {
                    this.notyfService.success('Tu outfit ahora es privado');
                    this.getAllByUser();
                } else {
                    this.notyfService.success('Tu outfit ahora es público');
                    this.getAllByUser();
                }
            },
            error: (err) => {
                if (!status) {
                    this.notyfService.error('Ha ocurrido un error al agregar tu outfit a favoritos.');
                } else {
                    this.notyfService.error('Ha ocurrido un error al retirar tu outfit de favoritos.');
                }
            }
        })
    }
update(outfit: IOutfit) {
    this.editCustomSource(`${outfit.id}`, outfit).subscribe({
        next: (response: any) => {
            this.notyfService.success('¡Tu outfit ha sido actualizado con éxito!');
            this.getAllByUser();
        },
        error: (err: any) => {
            console.error('error', err);
            this.notyfService.error('Ha ocurrido un error al actualizar tu outfit.')
        }
    });
  }

  getTrendigOutfits() {
    const url = `outfit/${this.authService.getUser()?.id}/trending`;
    return this.http.get<{ message: string; data: IOutfit[] }>(url);
}

}
