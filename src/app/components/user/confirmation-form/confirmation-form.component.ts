import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IUser} from '../../../interfaces';
import {CommonModule} from '@angular/common';
import {ProfileService} from '../../../services/profile.service';
import {ModalService} from '../../../services/modal.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {NotyfService} from "../../../services/notyf.service";

@Component({
    selector: 'app-confirmation-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './confirmation-form.component.html',
    styleUrl: './confirmation-form.component.scss'
})
export class ConfirmationFormComponent {

    @Input() confirmationForm!: FormGroup;
    public profileService: ProfileService = inject(ProfileService);
    public modalService: ModalService = inject(ModalService);
    public authService: AuthService = inject(AuthService);
    public notyfService: NotyfService = inject(NotyfService);

    constructor(private router: Router) {
    }

    deleteAccount() {
        let user = {
            isUserActive: false
        }
        this.deleteUser(user)
    }

    deleteUser(user: IUser) {

        this.profileService.deleteUser(user);
        this.closeModal();

        setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
        }, 3000);
    }

    closeModal() {
        this.modalService.closeAll();
    }
}
