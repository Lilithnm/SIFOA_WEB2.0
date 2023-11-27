import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomicilioModel, PersonajeModel } from '../../models/generales';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PersonajesService {

  strApi = '/api/Personaje';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }
    Crear(Personaje: PersonajeModel): Observable<PersonajeModel> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<PersonajeModel>(this.urlServer + this.strApi + '/Crear', Personaje , HTTPOPTIONS);
    }
    Actualizar(Personaje: PersonajeModel): Observable<PersonajeModel> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<PersonajeModel>(this.urlServer + this.strApi + '/Actualizar', Personaje , HTTPOPTIONS);
    }
    Eliminar(Personaje: PersonajeModel): Observable<PersonajeModel> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<PersonajeModel>(this.urlServer + this.strApi + '/Eliminar', Personaje , HTTPOPTIONS);
    }

    EliminarDomicilio(Domicilio: DomicilioModel): Observable<PersonajeModel> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<PersonajeModel>(this.urlServer + this.strApi + '/EliminaDomicilio', Domicilio , HTTPOPTIONS);
    }

}
