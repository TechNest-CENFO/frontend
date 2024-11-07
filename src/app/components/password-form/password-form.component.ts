import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../interfaces';


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
  public fb: FormBuilder = inject(FormBuilder);
  @Input() changePasswordForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();

}
