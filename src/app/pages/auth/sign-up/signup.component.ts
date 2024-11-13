import {CommonModule} from '@angular/common';
import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {IUser} from '../../../interfaces';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {UploadService} from "../../../services/upload.service";
import {HttpClientModule} from '@angular/common/http';
import {CustomValidators} from '../../../customValidators/custom-validators';
import {AlertService} from '../../../services/alert.service';
import {LoaderComponent} from "../../../components/loader/loader.component";
import {NotyfService} from "../../../services/notyf.service";
import {LottieComponentComponent} from "../../lottie-component/lottie-component.component";
import * as Aos from 'aos';


@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, NgxDropzoneModule, LoaderComponent, LottieComponentComponent],
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
    photoErrorMessage: string = '';
    passwordValidationMessages: string[] = [];
    validationMessageDate: string = "";
    differentPassword: string = "";
    passwordValue: string = "";
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;
    showLottie: boolean = false;
    public user: IUser = {};
    public isFormValid: boolean | null = null;
    public isValidDate: boolean = true;
    public isValidPassword: boolean = true;
    public isValidConfirmPassword: boolean = true;
    private alertService: AlertService = inject(AlertService);
    private notyfService: NotyfService = inject(NotyfService);


    constructor(private router: Router,
                private authService: AuthService,
                private _uploadService: UploadService,
    ) {
    }


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
    validatePassword(): boolean {

        if (this.passwordModel && this.passwordModel.value) {
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


        if (this.passwordValidationMessages.length > 0) {
            this.isValidPassword = false;
        } else {
            this.isValidPassword = true;
        }

        if (this.passwordValue === "") {
            this.passwordValidationMessages = [];
        }


        this.updateFormValidity();
        return this.isValidPassword;

    }

    validateConfirmPassword(): boolean {

        if (!CustomValidators.isPasswordEqualsConfirm(this.passwordModel?.value,
            this.confirmPasswordModel?.value)) {
            this.differentPassword = 'Las contraseñas no coinciden';
            this.isValidConfirmPassword = false;
        } else {
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
    lottie = {
        path: './assets/lottie/success.json',
        loop: false,
        autoplay: true
    };

    private uploadImage() {

        const file_data = this.files[0];
        this.updateFormValidity();
        const data = new FormData();
        data.append('file', file_data);
        data.append('upload_preset', 'technest-preset');
        data.append('cloud_name', 'dklipon9i');
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
                this.showLottie = !this.showLottie
                this.notyfService.success('¡Registro exitoso!')
            },
            error: (err: any) => {
                this.notyfService.error('Ha ocurrido un error al registrar tu usuario.')
            }
        });
        setTimeout(() => {
            this.redirectToLogin();
        }, 3000);
    }

    redirectToLogin() {
        this.router.navigate(['/login']);
    }

    onSelect(event: any) {
        this.photoErrorMessage = '';
        //const selectedFiles = event.addedFiles;
        const selectedFiles: any[] = event.addedFiles;

        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                const fileName = file.name; // El nombre del archivo (ej. "logo.png")

                // Obtener la extensión del archivo
                const fileExtension = fileName.split('.').pop()?.toLowerCase(); // Usamos `split` y `pop` para obtener la extensión

                if (fileExtension) {
                    // Validar la extensión (puedes agregar más validaciones si lo deseas)
                    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                        if (this.files.length > 1) {
                            this.photoErrorMessage = 'Solo se permite seleccionar una imagen.';
                            this.files = [];
                        } else {
                            this.files = [selectedFiles[0]];

                        }
                    } else {
                        this.photoErrorMessage = 'El archivo no es una imagen válida.';
                    }
                } else {
                    this.photoErrorMessage = 'El archivo no tiene extensión.';
                }
            });
        } else {
            this.photoErrorMessage = 'El archivo no es una imagen válida.';
        }

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

    ngOnInit() {
        Aos.init();
    }

}






 

