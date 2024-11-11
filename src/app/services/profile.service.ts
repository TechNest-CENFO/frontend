import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users/me';
  private userSignal = signal<IUser>({});
  private snackBar = inject(MatSnackBar);
  private alertService: AlertService = inject(AlertService);
  private authService: AuthService = inject(AuthService);


  get user$() {
    return  this.userSignal;
  }

  // getUserInfoSignal(): Observable<IUser> {
  //   this.findAll().subscribe({
  //     next: (response: any) => {
  //       this.userSignal.set(response);
  //     },
  //     error: (error: any) => {
  //       this.snackBar.open(
  //         `Error getting user profile info ${error.message}`,
  //          'Close', 
  //         {
  //           horizontalPosition: 'right', 
  //           verticalPosition: 'top',
  //           panelClass: ['error-snackbar']
  //         }
  //       )
  //     }
  //   })
  // }

  getUserInfoSignal(): Observable<IUser> {
    return this.http.get<IUser>('users/me'); 
  }


  updateUserPicture(user: IUser): Observable<IUser>{
    this.http.patch<IUser>(`users/profile/picture/${this.authService.getUser()?.id}`, user).subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
        const message = response?.message ?? 'Foto de perfil actualizada exitosamente';
        this.alertService.displayAlert('success', message, 'center', 'top', ['success-snackbar']);
        this.getUserInfoSignal();

      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando la foto de perfil', 'center', 'top', ['error-snackbar']);
      }
    });
    return this.http.patch<IUser>(`users/profile/${this.authService.getUser()?.id}`, user)

  }


  updateUserInfo(user: IUser){
      this.http.put<IUser>(`users/profile/${this.authService.getUser()?.id}`, user).subscribe({
        next: (response: any) => {
          this.userSignal.set(response);
          const message = response?.message ?? 'Usuario actualizado exitosamente';
          this.alertService.displayAlert('success', message, 'center', 'top', ['success-snackbar']);
          this.getUserInfoSignal();

        },
        error: (err: any) => {
          this.alertService.displayAlert('error', 'Ocurrió un error actualizando el usuario', 'center', 'top', ['error-snackbar']);
        }
      });
  }


  deleteUser(user: IUser){
    this.http.patch<IUser>(`users/profile/${this.authService.getUser()?.id}`, user).subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
        const message = response?.message ?? 'Usuario eliminado exitosamente';
        this.alertService.displayAlert('success', message, 'center', 'top', ['success-snackbar']);
        this.getUserInfoSignal();

      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error eliminando el usuario', 'center', 'top', ['error-snackbar']);
      }
    });
  }


  setProfilePrivate(user: IUser){
    this.http.patch<IUser>(`users/profile/privacy/${this.authService.getUser()?.id}`, user).subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
        const message = response?.message ?? 'Se modificó la privacidad del perfil';
        this.alertService.displayAlert('success', message, 'center', 'top', ['success-snackbar']);
        this.getUserInfoSignal();

      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al modificar la privacidad del perfil', 'center', 'top', ['error-snackbar']);
      }
    });
  }
}
