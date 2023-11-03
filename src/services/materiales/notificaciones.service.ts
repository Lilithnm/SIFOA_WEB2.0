import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../../environments/global';
import { NotificacionModel } from 'src/models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  strApi = '/api/Notificacion';
  constructor(private http: HttpClient) { }

  ObtenerNoti(Notificacion: NotificacionModel): Observable<NotificacionModel[]> {
    return this.http.post<NotificacionModel[]>(Server + this.strApi + '/Obtener' , Notificacion, HTTPOPTIONS);
  }

  CrearNotificacion(Notificacion: NotificacionModel): Observable<boolean> {
    return this.http.post<boolean>(Server + this.strApi + '/Crear', Notificacion , HTTPOPTIONS);
  }

  Leida(Notificacions: NotificacionModel): Observable<NotificacionModel[]> {
    return this.http.post<NotificacionModel[]>(Server + this.strApi + '/Leida', Notificacions, HTTPOPTIONS);
  }

}
