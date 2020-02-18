import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/usuario/auth.service';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private authUrl = `${environment.apiUrl}/api-token-auth`;

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url !== this.authUrl) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Token ${this.authService.getInfoLogin().userToken}`
                }
            });
        }
        return next.handle(req);
    }
}
