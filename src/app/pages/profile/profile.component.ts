import { IUser } from './../../interfaces/index';
import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/app-layout/elements/button/button.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { PasswordFormComponent } from '../../components/user/password-form/password-form.component';
import { ConfirmationFormComponent } from '../../components/user/confirmation-form/confirmation-form.component';
import { PrivacyConfirmationComponent } from '../../components/user/privacy-confirmation/privacy-confirmation.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { UploadService } from '../../services/upload.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    NgxDropzoneModule,
    FormsModule,
    PasswordFormComponent,
    ModalComponent,
    ConfirmationFormComponent,
    PrivacyConfirmationComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [UserService, UploadService]
})
export class ProfileComponent {
  public updateError!: string;
  public profileService = inject(ProfileService);
  public modalService: ModalService = inject(ModalService);
  public user: IUser = {};
  private alertService: AlertService = inject(AlertService);


  public fb: FormBuilder = inject(FormBuilder);
  confirmationForm = this.fb.group({
    id: [''],
    blocked: ['', Validators.required],
  })

  changePasswordForm = this.fb.group({
    id: [''],
    password: ['', Validators.required],
  })

  privacyConfirmationForm = this.fb.group({
    id: [''],
    blocked: ['', Validators.required],
  })


  public editMode = false;
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  

  public updateForm: {picture: string,
                      name: string,
                      lastname: string,
                      email:string,
                      dateOfBirth:string,
                      direction:string,
                      isUserActive: boolean,
                      updatedAt: Date
                     } = 
      {
        picture: '',
        name: '',
        lastname: '',
        email: '',
        dateOfBirth: '',
        direction: '',
        isUserActive: false,
        updatedAt: new Date('2024-04-04')
      };


  private getUserInfo (){
    this.profileService.getUserInfoSignal().subscribe((user: IUser) => {
      this.updateForm = {
        picture: user.picture || '',
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth || '',
        direction: user.direction || '',
        isUserActive: user.isUserActive || false,
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date('2024-04-04')
      };
    });
  }


  constructor(private authService: AuthService,
    private _uploadService: UploadService) {
    this.getUserInfo();
  }


  cancelEdit() {
    this.editMode = false; 
    this.getUserInfo();
  }


  //Inicio Imagen de perfil
  files: File[] = [];

  private uploadImage() {
    const file_data = this.files[0];
    const data = new FormData();

    data.append('file', file_data);
    data.append('upload_preset', 'technest-preset');
    data.append('cloud_name', 'dklipon9i');
   
    //sube la imagen a Cloudinary
    this._uploadService.uploadImage(data).subscribe(async (response) => {
      if (response) {
        //Guarda el usuario con el seteo de la imagen
        this.updateForm.picture = response.secure_url;
        let user = {
          picture: this.updateForm.picture,
        }
        await this.updateUserPicture(user);
      }
    });
  }

  private updateUserPicture(user: IUser){
    this.profileService.updateUserPicture(user).subscribe({
      next: () => {
        this.alertService.displayAlert('success', "Imagen de perfil actualizada exitosamente", 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    })
  }


   onSelect(event: any) {
    if (this.files.length >= 0) {
      this.onRemove(event);
    }
    this.files.push(...event.addedFiles);
    const file = this.files[0];
    if (file) {
      this.uploadImage();
    }
  }
    onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  //Fin Imagen de perfil


  handleUpdate(event: Event) {
    let user = {
      picture: this.updateForm.picture,
      name: this.updateForm.name,
      lastname: this.updateForm.lastname,
      email: this.updateForm.email,
      dateOfBirth: this.updateForm.dateOfBirth,
      direction: this.updateForm.direction,
      isUserActive: this.updateForm.isUserActive
    }
    this.updateUserInfo(user);
    this.editMode = false; 
  }


  updateUserInfo (user: IUser){
    this.profileService.updateUserInfo(user);
  }


  isProfileBlocked: boolean = false;

  ngOnInit(): void {
    this.loadProfilePrivacy();
  }


  loadProfilePrivacy() {
    this.profileService.getUserInfoSignal().subscribe((user: IUser) => {
      this.isProfileBlocked = user.isProfileBlocked ?? false;
    });
  }


  setProfilePrivacy() {
    let user = {
      isProfileBlocked: this.isProfileBlocked
    };
    this.setProfilePrivate(user);
  }

  setProfilePrivate(user: IUser){
    this.profileService.setProfilePrivate(user);
  }
}
