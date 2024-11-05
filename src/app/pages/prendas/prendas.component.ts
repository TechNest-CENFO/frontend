import { AuthService } from './../../services/auth.service';
import { AuthGuard } from './../../guards/auth.guard';
import { ClothingService } from './../../services/clothing.service';
import { Component, inject, ViewChild } from '@angular/core';
import { ModalService } from './../../services/modal.service';
import { ButtonComponent } from "../../components/app-layout/elements/button/button.component";
import { PrendasFormComponent } from "../../components/prendas/prendas-form/prendas-form.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { IClothing } from '../../interfaces';

@Component({
  selector: 'app-prendas',
  standalone: true,
  imports: [ButtonComponent, PrendasFormComponent, ModalComponent, LoaderComponent],
  templateUrl: './prendas.component.html',
  styleUrls: ['./prendas.component.scss']
})
export class PrendasComponent {
  public ClothingService: ClothingService = inject(ClothingService);
  public ModalService: ModalService = inject(ModalService);
  public AuthService: AuthService = inject(AuthService);
  @ViewChild('AddClothingModal') public AddClothingModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  clothingForm = this.fb.group({
    name: [''],
    is_favorite: [false],
    is_public: [false],
    image_url: ['']

  });



  saveClothing(clothing : IClothing) {
    this.ClothingService.save(clothing);
    this.ModalService.closeAll();

  }


}
