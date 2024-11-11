import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../interfaces';
import { ProfileService } from '../../../services/profile.service';
import { ModalService } from '../../../services/modal.service';


@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss'
})
export class PasswordFormComponent {
  public profileService: ProfileService = inject(ProfileService);
  public modalService: ModalService = inject(ModalService);
  //public fb: FormBuilder = inject(FormBuilder);
  @Input() changePasswordForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();




  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }
  

  closeModal(){
    this.modalService.closeAll();
  }


  changePassword(){
    let user = {
      password: this.changePasswordForm.value
    }
    this.profileService.changePassword(user);
  }

}
