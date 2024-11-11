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
export class ClothingService extends BaseService<IClothing>{

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
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred saving the categoria','center', 'top', ['error-snackbar']);
        console.error('error', err);
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
        console.log('prendas: ', response)
      },
      error: (err: any) => {
        console.error('error', err);
        this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
      }
    });
  }

  getAllFavoritesByUser() {
    this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/clothing`, {
      page: this.search.page,
      size: this.search.size
    }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        const allByType: IClothing[] = response.data.filter((item: { isFavorite: any; }) => item.isFavorite);
        this.clothingListSignal.set(allByType);
        console.log('prendas favoritas: ', allByType)
      },
      error: (err: any) => {
        console.error('error', err);
        this.notyfService.error('Ha ocurrido un error al cargas tus prendas.');
      }
    });
  }

  getAllByType(type:string) {
    console.log(type)
    this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/clothing`, {
      page: this.search.page,
      size: this.search.size
    }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        const allByType: IClothing[] = response.data.filter((item: { clothingType: any; }) => item.clothingType.type==type);
        this.clothingListSignal.set(allByType);
        console.log('prendas por tipo: ', allByType)
      },
      error: (err: any) => {
        console.error('error', err);
        this.notyfService.error('Ha ocurrido un error al cargas tus prendas.')
      }
    });
  }

  delete(clothing : IClothing) {
    this.delCustomSource(`${clothing.id}`)
  }
}



/**

  save(clothing: IClothing) {
    this.addCustomSource(`user/${this.authService.getUser()?.id}`, clothing).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred saving the categoria','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }



 */