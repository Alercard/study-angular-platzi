import { Component, OnInit } from '@angular/core';
import { switchMap, zip } from 'rxjs';
import { CreateProductDTO, Product, UpdateProductDTO } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total: number = 0;

  products: Product[] = [];
  productChosen!: Product;
  showProductDetail = false;
  today = new Date();
  date = new Date(2021, 11, 12);
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    // inyeccion de dependencias
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    // como el request es asyncrono es mejor usarlo aqui
    /*
    this.productsService.getProductsByPage(this.limit, this.offset)
    .subscribe(data => {
      this.products = data;
    })
    */
   this.loadMore();
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleProductDetail();

    this.productsService.getProduct(id)
    .subscribe(product => {
      this.productChosen = product;
      this.statusDetail = 'success';
    }, response => {
      alert(response);
      this.statusDetail = 'error';
    });
  }

  readAndUpdate(id: string) {
    this.productsService.getProduct(id)
    .pipe(
      // switchMap para ejecutar con dependencia
      switchMap(product => this.productsService.update(product.id, {title: 'changed 1'})),
      switchMap(product => this.productsService.update(product.id, {title: 'changed 2'})),
      switchMap(product => this.productsService.update(product.id, {title: 'changed 3'})),
    )
    .subscribe( data => {
      console.log(data)
    });

    // zip ayuda a ejecutar en paralelo
    zip(
      this.productsService.getProduct(id),
      this.productsService.update(id, {title: 'changed 1'})
    )
    .subscribe(responses => {
      const read = responses[0];
      const update = responses[1];
      console.log('read:', read, 'update: ', update);
    })
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'Nueva Descripcion',
      images: [''],
      price: 1000,
      categoryId: 2
    }
    this.productsService.create(product)
    .subscribe(product => {
      this.products.unshift(product);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Title Edited'
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(productEdited => {
      const productIx = this.products.findIndex( item => item.id == id);
      this.products[productIx] = productEdited;
      this.productChosen = productEdited;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(deleted => {
      if (deleted) {
        const productIx = this.products.findIndex( item => item.id == id);
        this.products.splice(productIx, 1);
        this.showProductDetail = false;
      }
    });
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit, this.offset)
    .subscribe(products => {
      // concat es para array inmutables por lo que se debe reaccianr a la variable
      this.products = this.products.concat(products);
      this.offset += this.limit;
    })
  }

}
