import { Component, Input } from '@angular/core';

import { Product } from '../../product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html'
})
export class ProductItemComponent {
  @Input() product: Product;
  @Input() id: string;
}
