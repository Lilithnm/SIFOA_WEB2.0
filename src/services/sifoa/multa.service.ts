import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MultaModel } from 'src/models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class MultaService {

  strApi = '/api/Multa';
  strOrden ='/api/Orden';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }


  ObtenerMulta(BusquedaMulta: MultaModel): Observable<MultaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<MultaModel>(this.urlServer + this.strApi + '/Obtener', BusquedaMulta , HTTPOPTIONS);
  }

  ObtenerMultas(BusquedaMulta: MultaModel): Observable<MultaModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<MultaModel[]>(this.urlServer + this.strApi + '/ObtenerTodas', BusquedaMulta , HTTPOPTIONS);
  }

  ActualizaMulta(Multa: MultaModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<number>(this.urlServer + this.strApi + '/Actualizar', Multa , HTTPOPTIONS);
  }

  CrearMulta(Multa: MultaModel): Observable<MultaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<MultaModel>(this.urlServer + this.strApi + '/Crear', Multa , HTTPOPTIONS);
  }

  ObtenerOrdenMulta(Multa: MultaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post(this.urlServer + this.strOrden + '/OrdenMulta', Multa , { responseType: 'blob' });
  }
  
  ObtenerOrdenDevolucion(Multa: MultaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post(this.urlServer + this.strOrden + '/OrdenDevoMulta', Multa , { responseType: 'blob' });
  }
  
  ObtenerPorTransferencia(BusquedaMulta: MultaModel): Observable<MultaModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<MultaModel[]>(this.urlServer + this.strApi + '/ObtenerPorTransferencia', BusquedaMulta , HTTPOPTIONS);
  }

}
