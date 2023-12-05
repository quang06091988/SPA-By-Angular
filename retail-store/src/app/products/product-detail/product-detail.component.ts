import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product;
  productsSubscription: Subscription;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.productsSubscription = this.productsService.productsBehaviorSubject.subscribe((productsResponse: Product[]) => {
        this.product = productsResponse.find(product => product.id == params['id']);
      });
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  onEditProduct() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteProduct() {
    this.productsService.deleteProductById(this.product.id).subscribe();
    this.router.navigate(['/products']);
  }
}
