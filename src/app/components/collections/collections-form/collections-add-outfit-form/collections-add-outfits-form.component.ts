import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA, effect,
    EventEmitter,
    Inject,
    inject, Injector,
    Input,
    OnInit,
    Output, runInInjectionContext,
    ViewChild
} from '@angular/core';
import {IClothing, ICollection, IOutfit} from "../../../../interfaces";
import {NgClass} from "@angular/common";
import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";

import {NotyfService} from "../../../../services/notyf.service";
import {filter} from "rxjs";
import {
    CollectionsManualOutfitCardComponent
} from '../collections-manual-outfit-card/collections-manual-outfit-card.component';
import {OutfitsCardComponent} from "../../../outfits/outfits-card/outfits-card.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RecommendationCardComponent} from "../../../recommendations/recommendation-card/recommendation-card.component";
import {SearchComponent} from "../../../search/search.component";
import {OutfitsService} from "../../../../services/outfits.service";

@Component({
    selector: 'app-collections-add-outfits-form',
    standalone: true,
    imports: [
        NgClass,
        CollectionsManualOutfitCardComponent,
        OutfitsCardComponent,
        RecommendationCardComponent,
        FormsModule,
        ReactiveFormsModule,
        SearchComponent
    ],
    templateUrl: './collections-add-outfits-form.component.html',
    styleUrl: './collections-add-outfits-form.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CollectionsAddOutfitsFormComponent implements OnInit {
    fb: FormBuilder = Inject(FormBuilder);
    @Input() collectionForm!: FormGroup;

    @Input() outfits!: IOutfit[];
    @Output() callSaveMethod = new EventEmitter<ICollection>();
    @Output() callUpdateMethod = new EventEmitter<ICollection>();
    @Output() getByValue = new EventEmitter<string>();

    public outfitsService: OutfitsService = inject(OutfitsService);
    private injector = inject(Injector);

    clothing: IClothing[] = [];
    getBy: string = 'all';
    dropdownOptionSelected: string = 'Tipo';

    selectedOutfits: IOutfit[] = [];
    filteredOutfits: IOutfit[] = [];

    ngOnInit() {
        runInInjectionContext(this.injector, () => {
            effect(() => {
                this.outfits = this.outfitsService.outfit$();
                this.filteredOutfits = [...this.outfits];
            });
        });
    }

    public setGetBy(getBy: string) {
        this.getBy = getBy;
        this.getByValue.emit(getBy);
    }

    public capitalizeAndReplace(text: string): string {
        if (!text) return ''; // Manejo de valores vacíos o nulos
        const formattedText = text.replace(/_/g, ' '); // Reemplaza '_' por espacios
        return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }

    public addOutfit(item: IOutfit) {
        if (item.isSelectedInSubModal && !this.selectedOutfits.includes(item)) {
            this.selectedOutfits.push(item);
        }
    }

    callSave() {
        let collection: ICollection = {
            name: this.collectionForm.controls['name'].value,
            outfits: [],
            user: {}
        }
        if (this.selectedOutfits.length) {
            collection.outfits = this.selectedOutfits;
        }

        if (collection.id) {
            this.callUpdateMethod.emit(collection);
        } else {
            this.callSaveMethod.emit(collection);
        }
    }

    callSetOutfits(outfit: IOutfit) {
        this.selectedOutfits.push(outfit);
    }

    onSearchTermChanged(searchTerm: string): void {
        this.filteredOutfits = this.outfits.filter(item =>
            item.name?.toLowerCase().includes(searchTerm)
        );
    }
}
