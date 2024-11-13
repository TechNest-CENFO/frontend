import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PasswordResetService} from "../../../services/password-reset.service";
import {ActivatedRoute} from '@angular/router';
import {IPasswordResetEntity} from "../../../interfaces";
import * as Aos from 'aos';
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {AlertService} from "../../../services/alert.service";
import {LottieComponent} from "ngx-lottie";
import {LottieComponentComponent} from "../../lottie-component/lottie-component.component";
import {HttpErrorResponse} from "@angular/common/http";
import {NotyfService} from "../../../services/notyf.service";


@Component({
    selector: 'app-password-reset',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgOptimizedImage,
        RouterLink,
        NgIf,
        NgClass,
        LottieComponent,
        LottieComponentComponent,
    ],
    templateUrl: './password-reset.component.html',
    styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {

    token: string | null = null;

    public passwordResetService: PasswordResetService = inject(PasswordResetService);

    form: FormGroup;

    showPassword: boolean = false;

    showLottie: boolean = false;

    showErrorMessage: boolean = false;

    errorMessage: string = '';

    showMissmatchErrorMessage: boolean = false;

    missmatchErrorMessage: string = '';

    private alertService: AlertService = inject(AlertService);

    lottieOptions = {
        path: './assets/lottie/success.json',
        autoplay: true,
        loop: false
    };

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private notyfService: NotyfService) {

        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]],
            passwordConfirmation: ['', Validators.required]
        }, {validator: this.passwordsMatchValidator});
    }

    ngOnInit(): void {
        Aos.init();
        this.route.paramMap.subscribe(params => {
            this.token = params.get('token');
            
        });
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    passwordsMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const passwordConfirmation = form.get('passwordConfirmation')?.value;
        return password === passwordConfirmation ? null : {mismatch: true};
    }

    delayedRedirect() {
        const delayInMilliseconds = 3000;

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, delayInMilliseconds);
    }

    public callResetPassword() {
        if (this.token && this.form.valid) {
            this.showErrorMessage = false;
            this.showMissmatchErrorMessage = false;
            let passwordResetEntity: IPasswordResetEntity = {
                token: this.token,
                newPassword: this.form.get('password')?.value
            }

            //Esto necesita arreglarse
            this.passwordResetService.resetPassword(passwordResetEntity).subscribe({
                next: () => {
                    this.delayedRedirect();
                    this.showLottie = true;
                    this.notyfService.success('Tu contraseña ha sido modificada.');
                },
                //Esta tomando el código 200 como error
                error: (err: HttpErrorResponse) => {
                    this.notyfService.error('El enlace ha expirado.');
                },
            });

        } else if (this.token && this.form.controls['password'].invalid) {
            this.showErrorMessage = true;
            this.errorMessage = "Al menos: 8 carateres, una letra, un número y un caracter especial.";

        } else {
            this.showErrorMessage = this.showErrorMessage = false
            this.showMissmatchErrorMessage = true;
            this.missmatchErrorMessage = 'Las contraseñas no coinciden.';
        }
    }
}
