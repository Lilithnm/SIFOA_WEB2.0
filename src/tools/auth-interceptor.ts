import { Injectable, ViewChild } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage['T'];

        if (!token) {
            return next.handle(req).pipe(catchError((error) => this.handleAuthError(error)));
        }
        const req1 = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        });

        return next.handle(req1).pipe(catchError((error) => this.handleAuthError(error)));
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/Autenticacion']);
            return of(err);
        }
        if (err.status === 500) {
            swal.fire({
                title: 'Error',
                text: err.error,
                icon: 'error'
            });
            return of(err);
        }
        return throwError(err);
    }

}
