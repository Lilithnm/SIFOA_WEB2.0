import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentrosModel } from '../../models/generales';
import { Server } from '../../environments/global';
import { SolicitudModel } from 'src/models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MailServce {
 
  strApi = '/api/SendMail';
  constructor(private http: HttpClient) { }

    enviaRecordatorio(solicitud: SolicitudModel): Observable<number> {
      return this.http.post<number>(Server + this.strApi + '/EnviaRecordatorio',solicitud ,HTTPOPTIONS);
    }

    correoCambia(solicitud: SolicitudModel): Observable<number> {
      return this.http.post<number>(Server + this.strApi + '/EnviaCambio',solicitud ,HTTPOPTIONS);
    }
  

}
