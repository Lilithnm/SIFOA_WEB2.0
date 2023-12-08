import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpedienteBaseModel, GeneralesModel } from '../../models/generales';
import { BeneficiarioMinModel } from 'src/models/modelos';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class GeneralesService {

  strApi = '/api/Generales';
  urlServer:string|null = "";
  constructor(private http: HttpClient) { 
  }


    ObtenerGenerales(BusquedaExpediente: ExpedienteBaseModel): Observable<GeneralesModel> {
        this.urlServer = localStorage.getItem('Server');
        return this.http.post<GeneralesModel>(this.urlServer + this.strApi + '/Obtener', BusquedaExpediente , HTTPOPTIONS);
    }

    ObtenerTodosGenerales(BusquedaExpediente: ExpedienteBaseModel): Observable<GeneralesModel[]> {
        this.urlServer = localStorage.getItem('Server');
        return this.http.post<GeneralesModel[]>(this.urlServer + this.strApi + '/ObtenerTodos', BusquedaExpediente , HTTPOPTIONS);
    }

    ObtenerValidar(BusquedaExpediente: ExpedienteBaseModel): Observable<GeneralesModel> {
        this.urlServer = localStorage.getItem('Server');
        return this.http.post<GeneralesModel>(this.urlServer+ this.strApi + '/ObtenerValidar', BusquedaExpediente , HTTPOPTIONS);
    }

    CrearGenerales(Generales: GeneralesModel): Observable<number> {
        this.urlServer = localStorage.getItem('Server');
        return this.http.post<number>(this.urlServer + this.strApi + '/Crear', Generales , HTTPOPTIONS);
    }

    buscaBeneficiario(nombre: string): Observable<BeneficiarioMinModel[]> {
      const body = '{"Identificador": 0}';
        this.urlServer = localStorage.getItem('Server');
        return this.http.post<BeneficiarioMinModel[]>(this.urlServer + '/api/Nomina/ObtenerBeneficiariosMin/'+nombre, JSON.stringify(body), HTTPOPTIONS);
    }

    ObtenerListadoExpedientes(BusquedaExpediente: ExpedienteBaseModel): Observable<GeneralesModel[]> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post<GeneralesModel[]>(this.urlServer+ this.strApi + '/ObtenerTodos', BusquedaExpediente , HTTPOPTIONS);
  }

  

}

