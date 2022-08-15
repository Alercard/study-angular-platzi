import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Category } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = `${environment.API_URL}/api/categories`;

  constructor(
    private http: HttpClient
  ) { }

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params.set('limit', limit);
      params.set('offset', offset);
    }
    return this.http.get<Category[]>(this.apiUrl, { params });
  }
}
