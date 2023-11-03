import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../../environments/global';
import { SolicitudModel } from '../../models/main';
import { AutenticacionService } from '../shared/autenticacion.service';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  strApi = '/api/Solicitud';
  imprime = '/api/ImprimeSolicitud';
  constructor(private http: HttpClient, private svcAuth: AutenticacionService) { }

  CrearSolicitud(Solicitud: SolicitudModel): Observable<number> {
    if(Solicitud.IdentificadorOrigen>1){
      Solicitud.UsuarioSolicita =  Solicitud.UsuarioSolicita;
    }else{
      Solicitud.UsuarioSolicita =  this.svcAuth.currentUserValue;
    }
    return this.http.post<number>(Server + this.strApi + '/Crear', Solicitud , HTTPOPTIONS);
  }

  ObtenerSolicitudes(BusquedaSolicitud: SolicitudModel): Observable<SolicitudModel[]> {
    return this.http.post<SolicitudModel[]>(Server + this.strApi + '/ObtenerTodas', BusquedaSolicitud , HTTPOPTIONS); }



    ObtenerSolicitud(BusquedaSolicitud: SolicitudModel): Observable<SolicitudModel> {
      return this.http.post<SolicitudModel>(Server + this.strApi + '/Obtener', BusquedaSolicitud , HTTPOPTIONS);
    }

    ActualizarSolicitud(Solicitud: SolicitudModel): Observable<number> {
      return this.http.put<number>(Server + this.strApi + '/Actualizar', Solicitud , HTTPOPTIONS);
    }


    ImprimeSolicitud(Solicitud: SolicitudModel): Observable<Blob> {
      return this.http.post(Server + this.imprime + '/Solicitud', Solicitud , { responseType: 'blob' });
    }

    ObtenerAdministrar(BusquedaSolicitud: SolicitudModel): Observable<SolicitudModel[]> {
      return this.http.post<SolicitudModel[]>(Server + this.strApi + '/ObtenerAdministar', BusquedaSolicitud , HTTPOPTIONS); }

      
    ObtenerTodas(): Observable<SolicitudModel[]> {
      return this.http.post<SolicitudModel[]>(Server + this.strApi + '/ObtenerAdmin' , HTTPOPTIONS); }
      
    ObtenerHistorico(BusquedaSolicitud: SolicitudModel): Observable<SolicitudModel[]> {
      return this.http.post<SolicitudModel[]>(Server + this.strApi + '/ObtenerSolHistorico' , HTTPOPTIONS); }


    ObtenerAlmacenista(BusquedaSolicitud: SolicitudModel): Observable<SolicitudModel[]> {
        return this.http.post<SolicitudModel[]>(Server + this.strApi + '/ObtenerAlmacenista' , HTTPOPTIONS); }
        


  }

