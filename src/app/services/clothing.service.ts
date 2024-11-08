import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IClothing, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

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
    size: 5
  }

  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  save(clothing: IClothing) {
    this.add(clothing).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred saving the categoria','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

    getAllByUser() {
    this.findAllWithParamsAndCustomSource(`user/${this.authService.getUser()?.id}/clothing`, { page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.clothingListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }


}
