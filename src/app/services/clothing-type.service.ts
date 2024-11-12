import { Injectable, signal } from '@angular/core';
import { IClothingType, IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClothingTypeService extends BaseService<IClothingType> {

  protected override source: string  = 'clothingType';
  private clothingTypeListSignal = signal<IClothingType[]>([]);

  getAll() : Observable<IResponse<IClothingType[]>>{
      console.log("GetAll", this.findAllTypes());
    return this.findAllTypes()
  }

  ngOnInit() {
    this.getAll();
  }
  
}
