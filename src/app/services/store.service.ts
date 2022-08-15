import { Injectable } from '@angular/core';
// BehaviorSubject: crear un obsevable para que un observador se suscriba a los cambios
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private myShoppingCart: Product[] = [];

  // RXJS
  // CREAMOS AL OBSERVABLE
  // al crear un BehaviorSubject, necesita un estado inicial como parametro
  // como en este caso, espera un array de productos, se le pasa un array en vacio
  // estado compartido
  private myCart = new BehaviorSubject<Product[]>([]);

  // RXJS
  // EXPONEMOS AL OBSERVABLE
  // generamos un suscritor y exponemos un observable
  // la declaracion del observable se lo define con un simbolo $ al final del nombre
  // myCart$ es el observable
  myCart$ = this.myCart.asObservable();

  constructor() { }

  getShoppingCart() {
    return this.myShoppingCart;
  }

  addProduct(product: Product) {
    this.myShoppingCart.push(product);

    // RXJS
    // emitimos el cambio y lo implementaremos en el nav component
    this.myCart.next(this.myShoppingCart);
  }

  getTotal() {
    return this.myShoppingCart.reduce( (sum, item) => sum + item.price, 0);
  }
}
