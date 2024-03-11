import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnexoModel, GarantiaModel, MultaModel, ReporteBusquedaModel, ReporteResultModel } from '../../models/main';
import { ExpedienteModel } from 'src/models/generales';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  strApi = '/api/Historial'; 
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

    HistorialAnexo(Anexo: AnexoModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/HistorialAnexo', Anexo , { responseType: 'blob' });
    }

    HistorialGarantia(Garantia: GarantiaModel): Observable<Blob> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post(this.urlServer + this.strApi + '/HistorialGarantia', Garantia , { responseType: 'blob' });
    }

    HistorialMulta(Multa: MultaModel): Observable<Blob> {
        this.urlServer = localStorage.getItem('Server');
        return this.http.post(this.urlServer + this.strApi + '/HistorialMulta', Multa , { responseType: 'blob' });
     }
    
    HistorialExpediente(Expediente: ExpedienteModel): Observable<Blob> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post(this.urlServer + this.strApi + '/HistorialExpediente', Expediente , { responseType: 'blob' });
   }
  
    

  
}
