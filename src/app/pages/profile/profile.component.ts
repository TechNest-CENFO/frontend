import { IUser } from './../../interfaces/index';
import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/app-layout/elements/button/button.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { PasswordFormComponent } from '../../components/password-form/password-form.component';
import { ConfirmationFormComponent } from '../../components/confirmation-form/confirmation-form.component';
import { ModalComponent } from '../../components/modal/modal.component';

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
    ConfirmationFormComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [UserService]
})
export class ProfileComponent {
  public updateError!: string;
  public profileService = inject(ProfileService);
  public modalService: ModalService = inject(ModalService);

  public fb: FormBuilder = inject(FormBuilder);
  confirmationForm = this.fb.group({
    id: [''],
    blocked: ['', Validators.required],
  })

  changePasswordForm = this.fb.group({
    id: [''],
    password: ['', Validators.required],
  })
  

  public editMode = false;
  public updateForm: {picture: string, name: string; lastname: string; email:string; dateOfBirth:string; direction:string } = {
    picture: '',
    name: '',
    lastname: '',
    email: '',
    dateOfBirth: '',
    direction: ''
  };

  // public editMode = {
  //   name: false,
  //   lastname: false,
  //   email: false,
  //   dateOfBirth: false,
  //   direction: false
  // };

  constructor(private router: Router, private userService: UserService, private _userService: UserService) {
    this.profileService.getUserInfoSignal().subscribe((user: IUser) => {
      this.updateForm = {
        picture: user.picture || '',
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth || '',
        direction: user.direction || ''
      };
    });
  }


  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  cancelEdit() {
    this.editMode = false; 
  
    this.profileService.getUserInfoSignal().subscribe((user: IUser) => {
      this.updateForm = {
        picture: user.picture || '',
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth || '',
        direction: user.direction || ''
      };
    });
  }

  files: File[] = [];

  onSelect(event: any) {
    if(this.files.length >= 0){
      this.onRemove(event);
    }
    this.files.push(...event.addedFiles);
  }

    onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  handleUpdate(event: Event) {
    let user = {
      picture: this.updateForm.picture,
      name: this.updateForm.name,
      lastname: this.updateForm.lastname,
      email: this.updateForm.email,
      dateOfBirth: this.updateForm.dateOfBirth,
      direction: this.updateForm.direction
    }
    this.updateUserInfo(user);
    this.editMode = false; 
  }

  updateUserInfo (user: IUser){
    this.profileService.updateUserInfo(user);
  }
}
