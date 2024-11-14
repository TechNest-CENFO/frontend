import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import {NotyfService} from "./notyf.service";

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);
  get users$() {
    return this.userListSignal;
  }
  public search: ISearch = { 
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  private notyfService: NotyfService = inject(NotyfService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }


  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.notyfService.success('¡Usuario agregado exitosamente!');
        this.getAll();
      },
      error: (err: any) => {
        this.notyfService.error('Error al crear el usuario.');
        console.error('error', err);
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.notyfService.success('¡Tu perfil fue editado exitosamente!');
        this.getAll();
      },
      error: (err: any) => {
        this.notyfService.error('Ha ocurrido un error al editar tu perfil.');
        console.error('error', err);
      }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.notyfService.success('Tu cuenta ha sido desactivada.')
        this.getAll();
      },
      error: (err: any) => {
        this.notyfService.error('Ha ocurrido un error al desactivar tu cuenta.')
        console.error('error', err);
      }
    });
  }
}
