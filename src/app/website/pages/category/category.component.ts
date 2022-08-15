import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId: string | null = null;
  limit: number = 10;
  offset: number = 0;
  products: Product[] = [];
  productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      switchMap(params => {
        this.categoryId = params.get('id');
        if (this.categoryId) {
          return this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
        }
        return [];
      })
    )
    .subscribe(products => {
      this.products = this.products.concat(products);
      if (products.length > 0) {
        this.offset += this.limit;
      }
    })

    this.route.queryParamMap
    .subscribe(params => {
      this.productId = params.get('product');
    });
  }

  onLoadMore() {
    if (this.categoryId) {
      this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
      .subscribe(products => {
        this.products = this.products.concat(products);
        if (products.length > 0) {
          this.offset += this.limit;
        }
      })
    }
  }

}
