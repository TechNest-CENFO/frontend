import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';

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
}
