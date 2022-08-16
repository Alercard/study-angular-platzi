import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`;
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password})
    .pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    );
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(rta => this.getProfile())
    );
  }

  logout() {
    this.tokenService.removeToken();
  }

  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/profile`)
    .pipe(
      tap(user => this.user.next(user))
    );
  }

  profileCuandoNoUsoInterceptor(token: string) {
    /* otro ejem para configurar headers mas flexible o para poder validar
    const headers = new HttpHeaders();
    headers.set('Authorization', `bearer ${token}`);
    */

    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: {
        Authorization: `bearer ${token}`,
        // otro ejm de cabecera: 'Content-type:' 'application/json'
      }
    });
  }
}
