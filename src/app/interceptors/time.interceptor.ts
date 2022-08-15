import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContext,
  HttpContextToken
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// CONTROLANDO SI DEBE O NO AGREGAR EL INTERCEPTOR AL REQUEST
// en este caso esta deshabilitado por defecto y se debe habilitar
// se puede hacer caso contrario
const CHECK_TIME = new HttpContextToken<boolean>(() => false);
export function checkTime() {
  return new HttpContext().set(CHECK_TIME, true);
}

@Injectable()
export class TimeInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // CONTROLANDO SI DEBE O NO AGREGAR EL INTERCEPTOR AL REQUEST
    if (request.context.get(CHECK_TIME)) {
      const start = performance.now()
      return next.handle(request)
      .pipe(
        // tap: nos deja correr un proceso sin modificar la respuesta del observador
        tap(response => {
          const time = (performance.now() - start) + 'ms';
          console.log('TimeInterceptor: ', request.url, time)
        })
      );
    }
    return next.handle(request);
  }
}
