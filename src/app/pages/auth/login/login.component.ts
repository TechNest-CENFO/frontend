import {CommonModule} from '@angular/common';
import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import * as Aos from 'aos';
import {NotyfService} from "../../../services/notyf.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    public loginError!: string;
    @ViewChild('email') emailModel!: NgModel;
    @ViewChild('password') passwordModel!: NgModel;
    private notyfService: NotyfService = inject(NotyfService);

    public loginForm: { email: string; password: string } = {
        email: '',
        password: '',
    };
    backgroundLoaded = false;
    backgroundUrl = "../../../../assets/img/login/stacked-waves-1.svg";

    ngOnInit(): void {
        Aos.init();
        const img = new Image();
        img.src = this.backgroundUrl;

        img.onload = () => {
            this.backgroundLoaded = true;
        };
    }

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    public handleLogin(event: Event) {
        event.preventDefault();
        if (!this.emailModel.valid) {
            this.emailModel.control.markAsTouched();
        }
        if (!this.passwordModel.valid) {
            this.passwordModel.control.markAsTouched();
        }
        if (this.emailModel.valid && this.passwordModel.valid) {
            this.authService.login(this.loginForm).subscribe({
                next: () => this.router.navigateByUrl('/app/dashboard'),
                error: (err: any) => {
                    this.notyfService.error('Por favor verifique sus datos.');
                }
            });
        }
    }
}
