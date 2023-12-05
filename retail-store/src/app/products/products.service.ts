import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Product, Provider } from './product.model';
import { AuthService } from '../auth/auth.service';

import { environment } from '../../environments/environment';

export interface InsertProductResponse {
  name: string;
}

export interface UpdateProductResponse {
  name: string;
  unitOfRetail: string;
  priceOfRetail: number;
  imagePath?: string;
  providers?: Provider[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products: Product[];
  productsBehaviorSubject = new BehaviorSubject<Product[]>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

  findAllProducts() {
    // const findAllProductsUrl = `https://retail-store-fb656-default-rtdb.firebaseio.com/${this.authService.user.id}/products.json`;
    const findAllProductsUrl = `${environment.firebaseRealtimeDatabase}/${this.authService.user.id}/products.json`;
    
    return this.http.get(findAllProductsUrl).pipe(
      map<Object, Product[]>(findAllProductsResponse => {
        if(!findAllProductsResponse) {
          return null;
        }
        return Object.keys(findAllProductsResponse).map(key => {
          return {
            ...findAllProductsResponse[key],
            id: key
          };
        })
      }),
      tap(findAllProductsResponse => {
        this.products = findAllProductsResponse;
        this.productsBehaviorSubject.next(this.products);
      })
    );
  }
  
  insertProduct(newProduct: Product) {
    // const insertUrl = `https://retail-store-fb656-default-rtdb.firebaseio.com/${this.authService.user.id}/products.json`;
    const insertUrl = `${environment.firebaseRealtimeDatabase}/${this.authService.user.id}/products.json`;
    
    return this.http.post<InsertProductResponse>(insertUrl, newProduct).pipe(
      tap(insertProductResponse => {
        const product = new Product(newProduct.name, newProduct.unitOfRetail, newProduct.priceOfRetail, newProduct.imagePath, newProduct.providers, insertProductResponse.name);
        if(!this.products) {
          this.products = [];
        }
        this.products.push(product);
        this.productsBehaviorSubject.next(this.products);
      })
    );
  }

  updateProduct(productId: string, newProduct: Product) {
    // const updateProductUrl = `https://retail-store-fb656-default-rtdb.firebaseio.com/${this.authService.user.id}/products/${productId}.json`;
    const updateProductUrl = `${environment.firebaseRealtimeDatabase}/${this.authService.user.id}/products/${productId}.json`;
    
    return this.http.put<UpdateProductResponse>(updateProductUrl, newProduct).pipe(
      tap(updateProductResponse => {
        const product = new Product(newProduct.name, newProduct.unitOfRetail, newProduct.priceOfRetail, newProduct.imagePath, newProduct.providers, productId);
        const index = this.products.findIndex(product => product.id == productId);
        this.products[index] = product;
        this.productsBehaviorSubject.next(this.products);
      })
    );
  }

  deleteProductById(productId: string) {
    // const deleteProductByIdUrl = `https://retail-store-fb656-default-rtdb.firebaseio.com/${this.authService.user.id}/products/${productId}.json`;
    const deleteProductByIdUrl = `${environment.firebaseRealtimeDatabase}/${this.authService.user.id}/products/${productId}.json`;

    return this.http.delete<null>(deleteProductByIdUrl).pipe(
      tap(deleteProductByIdResponse => {   
        const index = this.products.findIndex(product => product.id == productId);
        this.products.splice(index, 1);
        this.productsBehaviorSubject.next(this.products);
      })
    );
  }
}
