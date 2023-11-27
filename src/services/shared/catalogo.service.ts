import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  strApi = '/api/Catalogos';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }


    ObtenerCatalogo(obj: string, tipo: number): Observable<any> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post<any>(this.urlServer + this.strApi + '/Obtener/' + tipo, JSON.stringify(obj) , HTTPOPTIONS);
    }

    GuardarCatalogo(obj: string,  tipo: number): Observable<number> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post<number>(this.urlServer + this.strApi + '/Crear/' + tipo, JSON.stringify(obj) ,HTTPOPTIONS);
    }

}

