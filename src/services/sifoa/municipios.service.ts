import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MunicipioModel } from 'src/app/models/catalogos';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }


  obtenerMuncipios(): Observable<MunicipioModel[]> {
    const body = '{"Identificador": 0}';
    return this.http.post<MunicipioModel[]>(this.urlServer + '/api/Catalogos/Obtener/3', JSON.stringify(body), HTTPOPTIONS);
  }

}