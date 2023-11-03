import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentrosModel } from '../../models/generales';
import { Server } from '../../environments/global';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CentrosPeriodosService {

  strApi = '/api/Centros';
  constructor(private http: HttpClient) { }

  ObtenerCentrosPer(): Observable<CentrosModel[]> {
    return this.http.post<CentrosModel[]>(Server + this.strApi + '/ObtenerCentrosPer' , HTTPOPTIONS);
  }

  ActualizaPeriodo(Centro: CentrosModel): Observable<CentrosModel[]> {
    return this.http.post<CentrosModel[]>(Server + this.strApi + '/ActualizaPeriodo', Centro , HTTPOPTIONS);
  }

  AbrePeriodo(Centros: CentrosModel[]): Observable<CentrosModel[]> {
    return this.http.post<CentrosModel[]>(Server + this.strApi + '/AbrePeriodo', Centros, HTTPOPTIONS);
  }

  CierraPeriodo(Centros: CentrosModel[]): Observable<CentrosModel[]> {
    return this.http.post<CentrosModel[]>(Server + this.strApi + '/CierraPeriodo', Centros , HTTPOPTIONS);
  }


  ObtenerAdmin(): Observable<CentrosModel[]> {
    return this.http.post<CentrosModel[]>(Server + this.strApi + '/obtenerPerAdmin',  HTTPOPTIONS);
  }

 
}
