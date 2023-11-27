import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GarantiaModel } from '../../models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GarantiaService {

  strApi = '/api/Garantia';
  strOrden ='/api/Orden';  
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

  ObtenerGarantia(BusquedaGarantia: GarantiaModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel>(this.urlServer + this.strApi + '/Obtener', BusquedaGarantia , HTTPOPTIONS);
  }

  ObtenerGarantias(BusquedaGarantia: GarantiaModel): Observable<GarantiaModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel[]>(this.urlServer + this.strApi + '/ObtenerTodas', BusquedaGarantia , HTTPOPTIONS);
  }

  ObtenerOrdenGarantia(BusquedaGarantia: GarantiaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post(this.urlServer + this.strOrden + '/OrdenGarantia', BusquedaGarantia , { responseType: 'blob' });
  }

  CrearGarantia(Garantia: GarantiaModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel>(this.urlServer + this.strApi + '/Crear', Garantia , HTTPOPTIONS);
  }

  ActualizarGarantia(Garantia: GarantiaModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<number>(this.urlServer + this.strApi + '/Actualizar', Garantia , HTTPOPTIONS);
  }

  ObtieneDesdeAnexo(Garantia: GarantiaModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel>(this.urlServer + this.strApi + '/ObtenerDesdeAnexo', Garantia , HTTPOPTIONS);
  }

  ObtenerPorTransferencia(BusquedaGarantia: GarantiaModel): Observable<GarantiaModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel[]>(this.urlServer + this.strApi + '/ObtenerPorTransferencia', BusquedaGarantia , HTTPOPTIONS);
  }


  

}
