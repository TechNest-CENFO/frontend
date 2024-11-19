import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import {IClothing, IClothingType, IResponse, ISearch} from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs';
import {NotyfService} from "./notyf.service";

@Injectable({
  providedIn: 'root'
})
export class ClothingService extends BaseService<IClothing> {

  protected override source: string  = 'clothing';
  private clothingListSignal = signal<IClothing[]>([]);
  get clothing$() {
    return this.clothingListSignal;
  }

    public search: ISearch = {
    page: 1,
    size: 8
  }

  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);
  private notyfService: NotyfService = inject(NotyfService);

  save(clothing: IClothing) {
    this.addCustomSource(`user/${this.authService.getUser()?.id}`, clothing).subscribe({
      next: (response: any) => {
        this.notyfService.success('¡Tu prenda ha sido agregada exitosamente!');

        this.getAllByUser();
      },
      error: (err: any) => {
        this.notyfService.error('Ha ocurrido un error al agregar la prenda.');
      }
    });
  }

  getAll() : Observable<IResponse<IClothing[]>>{
    return this.findAllTypes();
    
  }

  ngOnInit() {
    this.getAll();
    this.getAllByUser();
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

  getAllFavoritesByUser() {
    this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/clothing/isFavorite`, {
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

  getAllByType(type:string) {
    this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/clothing/${type}`, {
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

  deleteClothingItem(clothing : IClothing) {
    const payload = { isClothingItemActive: clothing.isClothingItemActive };

    this.http.patch(`clothing/delete/${clothing.id}`, payload).subscribe({
      next: (response: any) => {
        this.clothing$
      },
      error: (err) =>{
        console.error(err);
      }
    })
  }


  update(clothing : IClothing) {
    this.delCustomSource(`${clothing.id}`)
  }
}



