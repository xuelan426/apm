import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, map, filter, tap } from 'rxjs/operators';
import { EMPTY, Subject, combineLatest } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  productSuppliers$ = this.productService.selectedProductWithSuppliers$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    }
    ),
  )

  pageTitles$ = this.product$.pipe(
    map((p: Product) =>
      p ? `Product Detail for: ${p.productName}` : null
    ),
  )

  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitles$
  ]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) =>
      ({
        product, productSuppliers, pageTitle
      }))
  )

  constructor(private productService: ProductService) { }

}
