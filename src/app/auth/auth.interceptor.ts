import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'Bearer ' + AuthService.getToken();
    const reqWithAuth = req.clone({headers: req.headers.append('Authorization', token)});
    return next.handle(reqWithAuth);
  }

}
