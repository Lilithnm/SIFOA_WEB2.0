import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../../environments/global';
import { MaterialModel } from 'src/models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  strApi = '/api/Materiales';
  constructor(private http: HttpClient) { }

    CrearActualizar(Materiales: MaterialModel): Observable<number> {
        return this.http.post<number>(Server + this.strApi + '/CrearActualizar', Materiales , HTTPOPTIONS);
    }

    ObtenerMateriales(BusquedaMateriales: MaterialModel): Observable<MaterialModel[]> {
        return this.http.post<MaterialModel[]>(Server + this.strApi + '/Obtener', BusquedaMateriales , HTTPOPTIONS); }



    ActualizaArchivo(Materiales: MaterialModel[]): Observable<MaterialModel> {
      return this.http.post<MaterialModel>(Server + this.strApi + '/ActualizaArchivo', Materiales , HTTPOPTIONS);
    }
    

  }

