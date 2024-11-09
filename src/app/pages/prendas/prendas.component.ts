import { AuthService } from './../../services/auth.service';

import { ClothingService } from './../../services/clothing.service';
import { Component, inject, ViewChild } from '@angular/core';
import { ModalService } from './../../services/modal.service';

import { PrendasFormComponent } from "../../components/prendas/prendas-form/prendas-form.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { IClothing } from '../../interfaces';
import {NgClass} from "@angular/common";
import {ClothingListComponent} from "../../components/prendas/clothing-list/clothing-list.component";


@Component({
  selector: 'app-prendas',
  standalone: true,
  imports: [PrendasFormComponent, ModalComponent, LoaderComponent, NgClass, ClothingListComponent],
  templateUrl: './prendas.component.html',
  styleUrls: ['./prendas.component.scss']
})
export class PrendasComponent {
  public clothingService: ClothingService = inject(ClothingService);
  public ModalService: ModalService = inject(ModalService);
  public AuthService: AuthService = inject(AuthService);
  
  
  @ViewChild('AddClothingModal') 
  public fb: FormBuilder = inject(FormBuilder);
  clothingForm = this.fb.group({
    name: [''],
    is_favorite: [false],
    is_public: [false],
    image_url: [''],
    type:[''],
    subType:[''],
    material:[''],
    season:[''],
    color:['']

  });
  clothingData: IClothing[] = []; // Almacenar los datos de las prendas
  gridSelected: boolean = true;
  totalClothes!: number;

  constructor(){}

  saveClothing(clothing : IClothing) {
    this.clothingService.save(clothing);
    this.ModalService.closeAll();

  }

  getTypeClothing() {
    // Método para obtener los datos nuevamente si es necesario
    this.clothingService.getAll().subscribe({
      next: (response) => {        
        this.clothingData = response.data;  // Puedes actualizar los datos aquí también
      },
      error: (err) => {
        console.error("Error en getTypeClothing", err);
      }
    });

  }

  ngOnInit(): void {
    // Llamamos a getAll() y al Observable para obtener los datos
    this.clothingService.getAll().subscribe({
      next: (response) => {
        // Accedemos a los datos y los almacenamos en la propiedad clothingData
        this.clothingData = response.data;         
      },
      error: (err) => {               
        err = "Ocurrió un error al cargar los datos.";
      }
    });
    this.clothingService.getAllByUser()
    this.totalClothes = this.clothingService.clothing$().length;
    console.log(this.totalClothes)
  }


  toggleGirdSelected() {
    this.gridSelected = !this.gridSelected;
  }
}
