import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-confirmation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './confirmation-form.component.html',
  styleUrl: './confirmation-form.component.scss'
})
export class ConfirmationFormComponent {
  @Input() confirmationForm!: FormGroup;
  public profileService: ProfileService = inject(ProfileService);


  deleteAccount(event: Event){
    let user = {
      isUserActive: false
    }
    this.deleteUser(user)
  }

  deleteUser(user: IUser){
    this.profileService.deleteUser(user);
  }
}
