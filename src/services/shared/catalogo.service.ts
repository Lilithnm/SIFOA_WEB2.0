import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../../environments/global';
import { BaseModel } from '../../models/catalogos';

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
  constructor(private http: HttpClient) { }

    ObtenerCatalogo(obj: BaseModel, tipo: number): Observable<any> {
      return this.http.post<any>(Server + this.strApi + '/Obtener/' + tipo, obj , HTTPOPTIONS);
    }

    GuardarCatalogo(obj: string,  tipo: number): Observable<number> {
      return this.http.post<number>(Server + this.strApi + '/Crear/' + tipo, JSON.stringify(obj) ,HTTPOPTIONS);
    }

    
   /*public enum CatalogoEnum
    {
        Elemento,
        Pais,
        Estado,
        Municipio,
        Centro,
        TipoExpediente,
        TipoJuicio,
        TipoPersonaje,
        TipoAnexo,
        Banco,
        Materia,
        Sistema,
        CentrosCosto,
        CentrosDgti,
        CentrosRH,
        Acreedor,
        RamosIndustriales,
        TiposTransferencia,
        Concepto --18*/
    

}

