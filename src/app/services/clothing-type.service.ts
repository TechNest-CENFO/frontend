import { Injectable } from '@angular/core';
import { IClothingType, IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClothingTypeService extends BaseService<IClothingType> {

    getAll() : Observable<IResponse<IClothingType[]>>{
    return this.findAllTypes()
  }

  
}
