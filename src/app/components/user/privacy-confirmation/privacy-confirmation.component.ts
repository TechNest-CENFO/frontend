import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-confirmation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './privacy-confirmation.component.html',
  styleUrl: './privacy-confirmation.component.scss'
})
export class PrivacyConfirmationComponent {
  @Input() privacyConfirmationForm!: FormGroup;
  @Input() isProfileBlocked: boolean = false;
  
  public profileService: ProfileService = inject(ProfileService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);

  constructor(private router: Router) { }

  closeModal(){
    this.modalService.closeAll();
  }

}
