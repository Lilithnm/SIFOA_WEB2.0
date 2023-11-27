import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentrosCostoModel, CentrosRHModel, CentrosDgtiModel, CentrosModel, AcreedorModel, RamosIndustrialesModel, CentrosCostoDetalleModel } from '../../models/catalogos';
import { Server } from 'src/environments/global';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CentrosService {

  strApi = '/api/Centros';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

    buscarCentro(Centro: CentrosModel): Observable<CentrosModel> {
    return this.http.post<CentrosModel>(Server + this.strApi + '/Buscar/4', JSON.stringify(JSON.stringify(Centro)) , HTTPOPTIONS);
    }

    obtenerCentrosH(): Observable<CentrosModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosModel[]>(this.urlServer + this.strApi + '/Obtener/4', HTTPOPTIONS);
    }
    guardarCentrosH(centro: CentrosModel): Observable<CentrosModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosModel[]>(this.urlServer + this.strApi+'/CreatUpDel/4',JSON.stringify(JSON.stringify(centro))  ,HTTPOPTIONS);
    }
    obtenerCentrosDgti(): Observable<CentrosDgtiModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosDgtiModel[]>(this.urlServer + this.strApi + '/Obtener/13', HTTPOPTIONS);
    }
    obtenerCentrosCosto(): Observable<CentrosCostoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosCostoModel[]>(this.urlServer + this.strApi + '/Obtener/12', HTTPOPTIONS);
    }
    guardarCentrosCosto(centro: CentrosCostoModel): Observable<CentrosCostoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosCostoModel[]>(this.urlServer + this.strApi+'/CreatUpDel/12', JSON.stringify(JSON.stringify(centro)), HTTPOPTIONS);
    }
    obtenerCentrosRh(): Observable<CentrosRHModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosRHModel[]>(this.urlServer + this.strApi + '/Obtener/14', HTTPOPTIONS);
    }
    guardarCentrosRh(centro: CentrosRHModel): Observable<CentrosRHModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosRHModel[]>(this.urlServer + this.strApi+'/CreatUpDel/14', JSON.stringify(JSON.stringify(centro)) ,HTTPOPTIONS);
    }
    obtenerAcreedores(): Observable<AcreedorModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<AcreedorModel[]>(this.urlServer + this.strApi+'/Obtener/15', HTTPOPTIONS);
    }
    guardarAcreedores(centro: AcreedorModel): Observable<AcreedorModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<AcreedorModel[]>(this.urlServer + this.strApi+'/CreatUpDel/15', JSON.stringify(JSON.stringify(centro)) ,HTTPOPTIONS);
    }
    obtenerRamos(): Observable<RamosIndustrialesModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<RamosIndustrialesModel[]>(this.urlServer + this.strApi+'/Obtener/16', HTTPOPTIONS);
    }    
    obtenerCentrosDetalle(): Observable<CentrosCostoDetalleModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<CentrosCostoDetalleModel[]>(this.urlServer + this.strApi+'/Obtener/19', HTTPOPTIONS);
    }


}
