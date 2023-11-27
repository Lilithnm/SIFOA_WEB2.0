import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DevolucionModel, ReporteBusquedaModel } from '../../models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {
  strApi = '/api/Devolucion';  
  strOrden ='/api/Orden';

  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }


  ObtenerDevolucion(BusquedaDevolucion: DevolucionModel): Observable<DevolucionModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DevolucionModel>(this.urlServer + this.strApi + '/Obtener', BusquedaDevolucion , HTTPOPTIONS);
  }
  ObtenerDevoluciones(BusquedaDevolucion: DevolucionModel): Observable<DevolucionModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DevolucionModel[]>(this.urlServer + this.strApi + '/ObtenerTodas', BusquedaDevolucion , HTTPOPTIONS);
  }
  CrearDevolucion(Devolucion: DevolucionModel): Observable<DevolucionModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DevolucionModel[]>(this.urlServer + this.strApi + '/Crear', Devolucion , HTTPOPTIONS);
  }
  Actualizar(Devolucion: DevolucionModel): Observable<DevolucionModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<DevolucionModel[]>(this.urlServer + this.strApi + '/Actualizar', Devolucion , HTTPOPTIONS);
  }
  Anular(Devolucion: DevolucionModel): Observable<DevolucionModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<DevolucionModel[]>(this.urlServer + this.strApi + '/Anular', Devolucion , HTTPOPTIONS);
  }
  ObtenerOrdenDevolucion(devolucion: DevolucionModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post(this.urlServer + this.strOrden + '/OrdenDevoGarantia', devolucion , { responseType: 'blob' });
  }

  ObtenerListaLiberacion(Busqueda: ReporteBusquedaModel): Observable<DevolucionModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DevolucionModel[]>(this.urlServer + this.strApi + '/ObtenerDevolucionesLiberacionMasiva', Busqueda , HTTPOPTIONS);
  }
  LiberacionMasiva(Devoluciones: DevolucionModel[]): Observable<boolean> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<boolean>(this.urlServer + this.strApi + '/LiberacionMasiva', Devoluciones , HTTPOPTIONS);
  }
  
}
