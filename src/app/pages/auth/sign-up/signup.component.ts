import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadService } from "../../../services/upload.service";
import { HttpClientModule } from '@angular/common/http';


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
  //picture
  

  public user: IUser = {};



  constructor(private router: Router, 
    private authService: AuthService,
    private _uploadService: UploadService
  ) {}

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
      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'angular_cloudinary');
      data.append('cloud_name','dnglop0de');
      //sube la imagen a Cloudinary
      this._uploadService.uploadImage(data).subscribe(response=>{      
        if(response){
          //Guarda el usuario con el seteo de la imagen
          this.user.picture = response.secure_url;
          this.authService.signup(this.user).subscribe({
            next: () => this.validSignup = true,
            error: (err: any) => (this.signUpError = err.description),
          });        
          
        }
      })
      this.authService.signup(this.user).subscribe({
        next: () => this.validSignup = true,
        error: (err: any) => (this.signUpError = err.description),
      });
    }
  }

  files: File[] = [];

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
