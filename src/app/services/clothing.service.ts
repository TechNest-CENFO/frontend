import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IClothing, IResponse, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs';

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
  }
}



