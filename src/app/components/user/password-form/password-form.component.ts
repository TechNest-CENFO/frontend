import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, NgModel, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IUser } from '../../../interfaces';
import { ProfileService } from '../../../services/profile.service';
import { ModalService } from '../../../services/modal.service';
import { AlertService } from '../../../services/alert.service';
import { CustomValidators } from '../../../customValidators/custom-validators';
import {NotyfService} from "../../../services/notyf.service";


@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss'
})
export class PasswordFormComponent {
  public signUpError!: String;
  public validSignup!: boolean;

  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('confirmPassword') confirmPasswordModel!: NgModel;

  public istrue = false;
  photoErrorMessage:string ='';
  passwordValidationMessages: string[] = [];
  validationMessageDate:string = "";
  differentPassword:string = "";
  passwordValue: string = "";
  showPassword:boolean = false;
  showConfirmPassword:boolean=false;
  public user: IUser = {};
  public isFormValid: boolean | null = null;

  public isValidPassword:boolean = true;
  public isValidConfirmPassword:boolean = true;
  private notyfService: NotyfService = inject(NotyfService);
  private profileService: ProfileService = inject(ProfileService);
  private modalService: ModalService = inject(ModalService);

  constructor(private fb: FormBuilder) {}


  changePassword(): void {
    this.handleFormValidation()
    if (!this.user) {
      this.notyfService.error('Por favor complete todos los campos requeridos.');
      return;
    }
    const passwordData = {
      password: this.user.password
    };

    this.profileService.passwordUpdate(passwordData).subscribe({
      next: () => {
        this.notyfService.success('Contraseña actualizada exitosamente');
      },
      error: (err: any) => {
        this.notyfService.error('Por favor complete todos los campos requeridos.');
      }
    });
    this.closeModal();
  }

  closeModal(){
    this.modalService.closeAll();
  }


  //FUNCIÓN QUE REGULA LAS EXPRESIONES REGULARES DEL PASSWORD 
  validatePassword(): boolean  {

    if(this.passwordModel && this.passwordModel.value){
      this.passwordValue = this.passwordModel.value;
    }      
    
    this.passwordValidationMessages = [];
    if (!CustomValidators.passwordIsNull(this.passwordValue)) {
      this.passwordValidationMessages.push('La contraseña es requerida.');
    }

    if (!CustomValidators.passwordPatternValid(this.passwordValue)) {
      this.passwordValidationMessages.push('La contraseña debe cumplir con los siguientes requisitos:');

      if (!CustomValidators.containsLowercase(this.passwordValue)) {
        this.passwordValidationMessages.push('Al menos una letra minúscula');
      }

      if (!CustomValidators.containsUppercase(this.passwordValue)) {
        this.passwordValidationMessages.push('Al menos una letra mayúscula');
      }

      if (!CustomValidators.containsNumbers(this.passwordValue)) {
        this.passwordValidationMessages.push('Al menos un número');
      }

      if (!CustomValidators.containsSpecialCharacter(this.passwordValue)) {
        this.passwordValidationMessages.push('Al menos un carácter especial');
      }

      if (!CustomValidators.minimunRequired(this.passwordValue) ||
          !CustomValidators.maximunRequired(this.passwordValue)) {
          this.passwordValidationMessages.push('Longitud de entre 8 y 16 caracteres');
      }
      
    }

    
    if(this.passwordValidationMessages.length > 0){
      this.isValidPassword = false;
    }else{
      this.isValidPassword = true;
    }
   
    if(this.passwordValue === ""){
      this.passwordValidationMessages = [];
    }
      
    this.updateFormValidity();
    return this.isValidPassword;
  }

  validateConfirmPassword():boolean{

    if (!CustomValidators.isPasswordEqualsConfirm(this.passwordModel?.value, 
      this.confirmPasswordModel?.value)) {
      this.differentPassword ='Las contraseñas no coinciden';
      this.isValidConfirmPassword = false;
    }else{
      this.isValidConfirmPassword = true;
    }
   

    this.updateFormValidity();
    return this.isValidConfirmPassword;
  }


  updateFormValidity() {
    // Verificamos que todos los campos estén válidos
    this.isFormValid = this.passwordModel?.valid && this.confirmPasswordModel?.valid &&
                       this.passwordValidationMessages.length === 0 &&
                       this.isValidPassword && this.isValidConfirmPassword; 
  }


  handleFormValidation(){
    if (!this.passwordModel.valid) {
      this.validatePassword();
      this.passwordModel.control.markAsTouched();
    }
    if (!this.confirmPasswordModel.valid) {
      this.confirmPasswordModel.control.markAsTouched();
    }
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
