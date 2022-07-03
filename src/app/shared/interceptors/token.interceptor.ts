import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('auth')) return next.handle(req);
    const headers = new HttpHeaders({ 'x-token': sessionStorage.getItem('token') })
    const reqClone = req.clone({ headers })
    return next.handle(reqClone)
  }

  errHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error?.message));
  }
}
