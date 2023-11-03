
import { AutenticacionService } from 'src/services/shared/autenticacion.service';

import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AutenticacionService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authService.Logout();
          location.reload();
        }
        if (err.status === 500) {
          swal.fire({
                title: 'Error',
                text: err.error,
                icon: 'error'
            });
        }
        

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
