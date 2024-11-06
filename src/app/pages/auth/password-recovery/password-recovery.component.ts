import {Component, inject} from '@angular/core';
import {PasswordRecoveryService} from "../../../services/password-recovery.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IToAddress} from "../../../interfaces";

@Component({
    selector: 'app-password-recovery',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './password-recovery.component.html',
    styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {

    public passwordRecoveryService: PasswordRecoveryService = inject(PasswordRecoveryService);

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            myInput: ['']
        });
    }

    callSendEmail() {
        let toAddress: IToAddress = {
            toAddress: this.form.get('myInput')?.value,
        }
        console.log("enter ts", toAddress.toAddress)
        this.passwordRecoveryService.sendEmail(toAddress);
    }
}
