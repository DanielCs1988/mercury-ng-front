import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token');
        if (token) {
            const header = 'Bearer ' + token;
            const reqWithAuth = req.clone({headers: req.headers.append('Authorization', header)});
            return next.handle(reqWithAuth);
        }
        return next.handle(req);
    }

}
