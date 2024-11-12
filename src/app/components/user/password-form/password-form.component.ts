import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../interfaces';
import { ProfileService } from '../../../services/profile.service';
import { ModalService } from '../../../services/modal.service';
import { AlertService } from '../../../services/alert.service';


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
  public alertService: AlertService = inject(AlertService);
  public user: IUser = {};
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
  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.alertService.displayAlert('error', 'Please complete all fields.', 'center', 'top', ['error-snackbar']);
      return;
    }
    const passwordData = {
      password: this.changePasswordForm.value.currentPassword
    };

    this.profileService.passwordUpdate(passwordData).subscribe({
      next: () => {
        this.alertService.displayAlert('success', "Password updated successfully", 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the password', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
    this.closeModal();
  }

  closeModal(){
    this.modalService.closeAll();
  }
}
