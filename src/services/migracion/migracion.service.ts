import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MigracionMaatModel, ReporteResultModel } from 'src/app/models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})


export class MigracionService {

  strApi = '/api/Migracion';
  strApiRep = '/api/Reportes';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }


    BuscaValida(BusquedaExpedientes: MigracionMaatModel): Observable<MigracionMaatModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<MigracionMaatModel>(this.urlServer + this.strApi + '/BuscaValida', BusquedaExpedientes , HTTPOPTIONS);
    }
  
    Migrar(BusquedaExpedientes: MigracionMaatModel): Observable<MigracionMaatModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<MigracionMaatModel>(this.urlServer + this.strApi + '/Migrar', BusquedaExpedientes , HTTPOPTIONS);
    }
  
    ResumenJuzgado(CentroH: number):  Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<ReporteResultModel[]>(this.urlServer + this.strApiRep + '/ReporteMigrados' ,CentroH,HTTPOPTIONS);
    }
    
  

}

