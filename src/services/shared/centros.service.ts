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
export class CentrosService {

  strApi = '/api/Centros';
  constructor(private http: HttpClient) { }

    buscarCentro(Centro: CentrosModel): Observable<CentrosModel> {
      return this.http.post<CentrosModel>(Server + this.strApi + '/Buscar/0', Centro, HTTPOPTIONS);
    }

    obtenerCentrosH(): Observable<CentrosModel[]> {
      return this.http.post<CentrosModel[]>(Server + this.strApi + '/Obtener/0', HTTPOPTIONS);
    }
    guardarCentrosH(centro: CentrosModel): Observable<CentrosModel[]> {
      return this.http.post<CentrosModel[]>(Server + this.strApi+'/CreatUpDel/0',JSON.stringify(JSON.stringify(centro))  ,HTTPOPTIONS);
    }
  
}
