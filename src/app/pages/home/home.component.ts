import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  limit = 10;
  offset = 0;
  productId: string | null = null;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productsService.getAll(this.limit, this.offset)
    .subscribe(products => {
      this.products = products;
      this.offset += this.limit;
    });

    this.route.queryParamMap
    .subscribe(params => {
      this.productId = params.get('product');
      console.log('productId', this.productId)
    });
  }

  onLoadMore() {
    this.productsService.getProductsByPage(this.limit, this.offset)
    .subscribe(products => {
      // concat es para array inmutables por lo que se debe reaccianr a la variable
      this.products = this.products.concat(products);
      this.offset += this.limit;
    })

  }

}
