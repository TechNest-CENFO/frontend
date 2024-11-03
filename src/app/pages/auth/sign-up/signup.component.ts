import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgModel, Validators, FormBuilder, FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadService } from "../../../services/upload.service";
import { HttpClientModule } from '@angular/common/http';
import { customValidator } from '../../../customValidators/custom-validators';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule],
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
  
  validationMessages: string[] = [];
  dateError: string | null = null;
 
  formBuilder = inject(FormBuilder);
  formGroup : FormGroup = this.formBuilder.group({
    password: ['', [customValidator]]
  })


  public user: IUser = {};


  validateDate(){
    const selectedDate= new Date(this.dateOfBirthModel.value);
    const today = new Date(this.getFormattedDate());
    this.validationMessages = [];

    if (selectedDate === null || selectedDate === undefined ) {
      this.validationMessages.push('La fecha de nacimiento es requerida.');
      return ;
    }else if(selectedDate >= today){
      this.validationMessages.push('La fecha de nacimiento no puede ser mayor al actual.');
      return ;
    }
    
  }

  getFormattedDate(): Date {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
    const day = String(today.getDate()).padStart(2, '0');
  
    return new Date(`${year}/${month}/${day}`); // Devuelve la fecha en formato "YYYY/MM/DD"
  }

  validatePassword()  {    
    console.log(this.passwordModel.errors);
    let passwordValue: string = this.passwordModel.value;
    this.validationMessages = []; // Reiniciar mensajes de validación

    if (passwordValue === null || passwordValue === undefined || passwordValue === "") {
      this.validationMessages.push('La contraseña es requerida.');
      return ;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;


   
    if (!passwordPattern.test(passwordValue)) {
      this.validationMessages.push('La contraseña debe cumplir con los siguientes requisitos:');
      
      
      if (!/(?=.*[a-z])/.test(passwordValue)) {
        this.validationMessages.push('- Al menos una letra minúscula');

      }
      if (!/(?=.*[A-Z])/.test(passwordValue)) {
        this.validationMessages.push('- Al menos una letra mayúscula');

      }
      if (!/(?=.*\d)/.test(passwordValue)) {
        this.validationMessages.push('- Al menos un número');

      }
      if (!/(?=.*[@$!%*?&])/.test(passwordValue)) {
        this.validationMessages.push('- Al menos un carácter especial');

      }
      if(this.passwordModel.validator?.length.toString){
        if (this.passwordModel.validator?.length < 8 || this.passwordModel.validator?.length > 16) {
          this.validationMessages.push('- Longitud de entre 8 y 16 caracteres');
  
        }
      }

      if(this.validationMessages.length > 0){
        this.passwordModel.control.markAsTouched();
        this.passwordModel.validator

      }


      
    }

   
  }

  constructor(private router: Router, 
    private authService: AuthService,
    private _uploadService: UploadService,
  ) { }





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
      this.validateDate();
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
      next: () => this.validSignup = true ,
      error: (err: any) => (this.signUpError = err.description),
    });

    if(this.validSignup){
      this.redirectToLogin();
    }
  }

  redirectToLogin() {
    console.log("ingresó");
    this.router.navigate(['/login']);
    
  }

  onSelect(event: any) {
    if(this.files.length >= 0){
      this.onRemove(event);
    }
    this.files.push(...event.addedFiles);
  }

  pass(password:string, confirmpass:string){
    if(password !== confirmpass){
      console.log("diferente");
    }
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


}


export const otra : ValidatorFn = (control : AbstractControl, ): ValidationErrors | null =>{
  return null;
  

}




 

