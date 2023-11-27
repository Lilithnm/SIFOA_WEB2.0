import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransferenciaModel, TransferibleModel } from '../../models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  strApi = '/api/Transferencia';  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

  CrearTransferencia(Transferencia: TransferenciaModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<number>(this.urlServer + this.strApi + '/Crear', Transferencia , HTTPOPTIONS);
  }

  ActualizarTransferencia(Transferencia: TransferenciaModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<number>(this.urlServer + this.strApi + '/Actualizar', Transferencia , HTTPOPTIONS);
  }
  
  ObtenerTransferencia(Transferencia: TransferenciaModel): Observable<TransferenciaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<TransferenciaModel>(this.urlServer + this.strApi + '/ObtenerTransferencia', Transferencia , HTTPOPTIONS);
  }

  ObtenerTransferencias(Transferencia: TransferenciaModel): Observable<TransferenciaModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<TransferenciaModel[]>(this.urlServer + this.strApi + '/ObtenerTransferencias', Transferencia , HTTPOPTIONS);
  }
  
  ObtenerTransferibles(Transferencia: TransferenciaModel): Observable<TransferibleModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<TransferibleModel[]>(this.urlServer + this.strApi + '/ObtenerTransferibles', Transferencia , HTTPOPTIONS);
  }
}