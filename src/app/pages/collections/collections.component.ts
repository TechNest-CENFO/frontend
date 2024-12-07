import {Component, effect, inject, Injector, OnInit, runInInjectionContext, ViewChild} from '@angular/core';
import {ClothingListComponent} from "../../components/prendas/clothing-list/clothing-list.component";
import {LoaderComponent} from "../../components/loader/loader.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import {PrendasFormComponent} from "../../components/prendas/prendas-form/prendas-form.component";
import {ModalService} from "../../services/modal.service";
import {NgClass} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import { CollectionsListComponent } from '../../components/collections/collections-list/collections-list.component';
import {FormBuilder, Validators} from "@angular/forms";
import {IClothing, ICollection, IOutfit} from "../../interfaces";
import {ClothingService} from "../../services/clothing.service";
import { SearchComponent } from '../../components/search/search.component';
import { CollectionsService } from '../../services/collections.service';
import { CollectionsAddOutfitsFormComponent } from '../../components/collections/collections-form/collections-add-outfit-form/collections-add-outfits-form.component';
import {OutfitsService} from "../../services/outfits.service";
import {OutfitsCardComponent} from "../../components/outfits/outfits-card/outfits-card.component";
@Component({
  selector: 'app-collections',
  standalone: true,
    imports: [ClothingListComponent,
        LoaderComponent,
        ModalComponent,
        PaginationComponent,
        PrendasFormComponent,
        NgClass,
        CollectionsListComponent,
        SearchComponent,
        CollectionsAddOutfitsFormComponent, OutfitsCardComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit{
    public collectionsService: CollectionsService = inject(CollectionsService);
    public clothingService: ClothingService = inject(ClothingService);
    public outfitsService: OutfitsService = inject(OutfitsService);
    public ModalService: ModalService = inject(ModalService);
    public AuthService: AuthService = inject(AuthService);
    private injector = inject(Injector);
    collections: ICollection[] = [];
    filteredCollections: ICollection[] = [];


    getBy: string = "all";
    protected optionSelected: string = 'Tipo';
    gridSelected: boolean = true;
    isAddClothingModalActive: boolean = false;

    getByOption: string = 'all';

    public setGetByOption(getByOption: string) {
        this.getByOption = getByOption;
    }

    public setClothingSignalForSubModal() {
        if (this.getByOption==='all'){
            this.clothingService.getAllByUserLongPagination();
        } else if (this.getByOption === 'favorite'){
            this.clothingService.getAllFavoritesByUserLongPagination();
        } else {
            this.clothingService.getAllByTypeLongPagination(this.getByOption);
        }
    }
    //FIN - METODOS Y VARIABLES PARA EL SUBMODAL

    //Prendas a agregar al collectionManual
    manualCollectionClothing: IClothing[] = [];

    @ViewChild('AddCollectionModal')
    public fb: FormBuilder = inject(FormBuilder);
    collectionForm = this.fb.group({
        name: ['', Validators.required],
        clothing: ['', Validators.required],
        user: this.AuthService.getUser()
    });

    ngOnInit(): void {
        this.callGet();

        runInInjectionContext(this.injector, () => {
            effect(() => {
              this.collections = this.collectionsService.collection$();
              this.filteredCollections = [...this.collections];
            });
          });
          this.clothingService.getAllByUser();

          this.outfitsService.getAllByUser();
    }


    onSearchTermChanged(searchTerm: string): void {
        this.filteredCollections = this.collections.filter(item =>
            item.name?.toLowerCase().includes(searchTerm)
        );
    }



    setGetBy(category: string) {
        this.getBy = category;
        this.callGet();
    }

    toggleGirdSelected() {
        this.gridSelected = !this.gridSelected;
    }

    callGet() {
        if (this.getBy == 'all') {
            this.collectionsService.getAllByUser();
            this.optionSelected = 'Tipo';

        } else if (this.getBy == 'favorite') {
            this.collectionsService.getAllFavoritesByUser();
            this.optionSelected = 'Tipo';
            

        } else {
            this.collectionsService.getAllByType(this.getBy);
            this.optionSelected = this.capitalizeAndReplace(this.getBy);
        }
    }

    capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    saveCollection(collection: ICollection) {
        collection.user.id = this.AuthService.getUser()?.id;
        this.collectionsService.save(collection);
        this.ModalService.closeAll();
        this.collectionForm.reset();
    }

    toggleAddClothingModal() {
        this.isAddClothingModalActive = !this.isAddClothingModalActive;
    }

}
