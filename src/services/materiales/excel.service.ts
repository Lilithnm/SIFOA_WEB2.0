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
export class ExcelService {

  strApi = '/api/Excel';
  constructor(private http: HttpClient) { }

  OrdenAlmacenSap(SolicitudModel: SolicitudModel): Observable<Blob>{
    return this.http.post(Server + this.strApi + '/OrdenAlmacenSap' ,SolicitudModel,  { responseType: 'blob' });
  }

 
}
