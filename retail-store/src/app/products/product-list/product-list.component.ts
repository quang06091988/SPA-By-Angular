import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs'

import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy  {
  products: Product[];
  productsSubscription: Subscription;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.productsSubscription = this.productsService.productsBehaviorSubject.subscribe(products => {
      this.products = products;
    });
    this.productsService.findAllProducts().subscribe();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  onNewProduct() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
