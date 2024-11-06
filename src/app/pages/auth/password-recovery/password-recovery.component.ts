import {Component, inject} from '@angular/core';
import {PasswordRecoveryService} from "../../../services/password-recovery.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IToAddress} from "../../../interfaces";
import * as Aos from 'aos';
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {LottieComponent} from "ngx-lottie";
import {LottieComponentComponent} from "../../lottie-component/lottie-component.component";
import {NotyfService} from "../../../services/notyf.service";

@Component({
    selector: 'app-password-recovery',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        LottieComponent,
        LottieComponentComponent
    ],
    templateUrl: './password-recovery.component.html',
    styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {

    public passwordRecoveryService: PasswordRecoveryService = inject(PasswordRecoveryService);

    form: FormGroup;
    showLottie: boolean = false;
    private alertService: AlertService = inject(AlertService);
    showErrorMessage: boolean = false;
    errorMessage: string = '';

    lottie = {
        path: './assets/lottie/emailSent.json',
        loop: false,
        autoplay: true
    };


    constructor(private fb: FormBuilder, private router: Router, private notyfService: NotyfService) {
        this.form = this.fb.group({
            myInput: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
        });
    }

    ngOnInit() {
        Aos.init();
    }

    goBack(){
        this.router.navigateByUrl('/login');
    }

    callSendEmail() {
        if (this.form.valid) {
            this.showErrorMessage = false;
            let toAddress: IToAddress = {
                toAddress: this.form.get('myInput')?.value,
            }
            this.passwordRecoveryService.sendEmail(toAddress).subscribe({
                next: () => {
                    this.notyfService.success('Email enviado. Puedes cerrar esta ventana.')
                    this.showLottie = true
                },
                error: (err: any) => {
                    this.notyfService.error('El correo ingresado no está vinculado a ninguna cuenta.');
                },
            });

        } else {
            this.errorMessage = "Ingrese un correo inválido.";
            this.showErrorMessage = true;
        }
    }
}
