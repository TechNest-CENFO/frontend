import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgModel, Validators, FormBuilder, FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadService } from "../../../services/upload.service";
import { HttpClientModule } from '@angular/common/http';
import { CustomValidators } from '../../../customValidators/custom-validators';
import { AlertService } from '../../../services/alert.service';
import { LoaderComponent } from "../../../components/loader/loader.component";


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule, LoaderComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [UploadService]
  
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('direction') directionModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('confirmPassword') confirmPasswordModel!: NgModel;
  @ViewChild('dateOfBirth') dateOfBirthModel!: NgModel;
  @ViewChild('picture') pictureModel!: NgModel;
  public istrue = false;
  
  passwordValidationMessages: string[] = [];
  validationMessageDate:string = "";
  differentPassword:string = "";
  passwordValue: string = "";
  showPassword:boolean = false;
  showConfirmPassword:boolean=false;
  public user: IUser = {};
  public isFormValid: boolean | null = null;
  public isValidDate:boolean = true;
  public isValidPassword:boolean = true;
  public isValidConfirmPassword:boolean = true;
  private alertService: AlertService = inject(AlertService);


  constructor(private router: Router, 
    private authService: AuthService,
    private _uploadService: UploadService,
  ) { }


  //VALIDAR LA FECHA ACTUAL INGRESA PERO SE DEBE BUSCAR LA FORMA DE HACER UN VALIDATOR
  validateDate(): boolean {   
    if (this.user.dateOfBirth) {
        const selectedDate = new Date(this.user.dateOfBirth); // Convierte a objeto Date
        const today = new Date(); // Obtiene la fecha actual

        this.validationMessageDate = "";

        // Compara las fechas
        if (selectedDate > today) {
            this.validationMessageDate = 'La fecha de nacimiento no puede ser mayor a la actual.';
            this.isValidDate = false;
        } else {
            this.isValidDate = true;
        }

        this.updateFormValidity();
    }
    
    return this.isValidDate;
}



  //FUNCIÓN QUE REGULA LAS EXPRESIONES REGULARES DEL PASSWORD 
  //Mapea los mensajes aenviar y consulta al validator para confirmar si es valido o no
  validatePassword(): boolean  {
    if(this.passwordModel && this.passwordModel.value){
      this.passwordValue = this.passwordModel.value;
    }      
    
    this.passwordValidationMessages = []; // Reiniciar mensajes de validación
    
    if (!CustomValidators.passwordIsNull(this.passwordValue)) {
      this.passwordValidationMessages.push('La contraseña es requerida.');
    }
    
    if (!CustomValidators.passwordPatternValid(this.passwordValue)) {
      this.passwordValidationMessages.push('La contraseña debe cumplir con los siguientes requisitos:');
      
      
      if (!CustomValidators.containsLowercase(this.passwordValue)) {
        this.passwordValidationMessages.push('- Al menos una letra minúscula');
      }

      if (!CustomValidators.containsUppercase(this.passwordValue)) {
        this.passwordValidationMessages.push('- Al menos una letra mayúscula');

      }
      if (!CustomValidators.containsNumbers(this.passwordValue)) {
        this.passwordValidationMessages.push('- Al menos un número');

      }
      if (!CustomValidators.containsSpecialCharacter(this.passwordValue)) {
        this.passwordValidationMessages.push('- Al menos un carácter especial');
      }
      
      if (!CustomValidators.minimunRequired(this.passwordValue) || 
          !CustomValidators.maximunRequired(this.passwordValue)) {
          this.passwordValidationMessages.push('- Longitud de entre 8 y 16 caracteres');
      }
      
    }

    if(this.passwordValidationMessages.length > 0){
      this.isValidPassword = false;
    }else{
      this.isValidPassword = true;
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





  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.directionModel.valid) {
      this.directionModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.validatePassword();
      this.passwordModel.control.markAsTouched();
    }
    if (!this.confirmPasswordModel.valid) {
      this.confirmPasswordModel.control.markAsTouched();
    }
    if (!this.dateOfBirthModel.valid) {      
      this.dateOfBirthModel.control.markAsTouched();
    }
    //confirmPasswordModel
    if (this.emailModel.valid && this.passwordModel.valid) {
      //varaibles para cloudinary
      this.uploadImage();

    }
  }


  files: File[] = [];
  
  private uploadImage() {
    
    const file_data = this.files[0];
    this.updateFormValidity();
    const data = new FormData();
    data.append('file', file_data);
    data.append('upload_preset', 'angular_cloudinary');
    data.append('cloud_name', 'dnglop0de');
    //sube la imagen a Cloudinary
    this._uploadService.uploadImage(data).subscribe(async (response) => {
      if (response) {
        //Guarda el usuario con el seteo de la imagen
        this.user.picture = response.secure_url;
        await this.singUploadUser();

      }
    });
  }

  private singUploadUser() { 
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.alertService.displayAlert('success', "Usuario registrado con exito", 'center', 'top', ['success-snackbar']);
        
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  
    setTimeout(()=>{
      this.redirectToLogin();
      
    }, 3000);
    
  }

  redirectToLogin() {    
    this.router.navigate(['/login']);    
  }

  onSelect(event: any) {
    if(this.files.length >= 0){
      this.onRemove(event);
    }
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {    
    this.files.splice(this.files.indexOf(event), 1);
    this.updateFormValidity();
  }

  updateFormValidity() {
 
    // Verificamos que todos los campos estén válidos
    this.isFormValid = this.nameModel?.valid && this.emailModel?.valid &&
                       this.lastnameModel?.valid && this.directionModel?.valid &&
                       this.passwordModel?.valid && this.confirmPasswordModel?.valid &&
                       this.dateOfBirthModel?.valid &&
                       this.passwordValidationMessages.length === 0 &&
                       this.files.length !== 0 && this.isValidDate && this.isValidPassword && this.isValidConfirmPassword; // También chequeamos las validaciones de contraseñas
  }


}






 

