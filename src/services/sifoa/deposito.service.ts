import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepositoModel } from '../../models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DepositoService {
  strApi = '/api/Deposito';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

  ObtenerDeposito(BusquedaDeposito: DepositoModel): Observable<DepositoModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DepositoModel>(this.urlServer + this.strApi + '/Obtener', BusquedaDeposito , HTTPOPTIONS);
  }
  ObtenerDepositos(BusquedaDeposito: DepositoModel): Observable<DepositoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DepositoModel[]>(this.urlServer + this.strApi + '/ObtenerTodos', BusquedaDeposito , HTTPOPTIONS);
  }
  CrearDeposito(Deposito: DepositoModel): Observable<DepositoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DepositoModel[]>(this.urlServer + this.strApi + '/Crear', Deposito , HTTPOPTIONS);
  }
  Actualizar(Deposito: DepositoModel): Observable<DepositoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<DepositoModel[]>(this.urlServer + this.strApi + '/Actualizar', Deposito , HTTPOPTIONS);
  }
  Anular(Deposito: DepositoModel): Observable<DepositoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<DepositoModel[]>(this.urlServer + this.strApi + '/Anular', Deposito , HTTPOPTIONS);
  }

}
