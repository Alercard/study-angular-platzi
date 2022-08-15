import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api`;
  constructor(
    private http: HttpClient
  ) { }

  getAll(limit?: number, offset?: number) {
    let params =  new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.InternalServerError) {
          return throwError(() => new Error("Algo esta fallando en el servidor!"));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError(() => new Error("El producto no existe!"));
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError(() => new Error("No estas autorizado!"));
        }
        return throwError(() => new Error("Ups algo salio mal!"));
      })
    );
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}/products`,
      {
        params: { limit, offset},
        // CONTROLANDO SI DEBE O NO AGREGAR EL INTERCEPTOR AL REQUEST
        context: checkTime() // habilito que aplique el interceptor de time
      })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  getByCategory(categoryId: string, limit: number, offset: number) {
    let params =  new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, {params})
  }

  create(data: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}/products`, data);
  }

  update(id: string, dto: UpdateProductDTO) {
    // verbo put: espera recibir todos los atributos
    // verbo patch: espera recibir solo los atributos modificados
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    // la api devuelve boolean si logra eliminar el producto
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }

}
