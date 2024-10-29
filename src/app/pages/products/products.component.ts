import { Component } from '@angular/core';
import { ProductListComponent } from "../../components/products/product-list/product-list.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

}
