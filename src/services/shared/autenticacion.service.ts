import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Server } from '../../environments/global';
import { Functions } from 'src/tools/functions';
import { TicketModel, UsuarioMinModel, UsuarioModel } from 'src/models/modelos';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',    
    'Access-Control-Allow-Headers': 'Content-Type'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  strToken!: string;
  private currentUserSubject: BehaviorSubject<UsuarioModel>;
  public currentUser: Observable<UsuarioModel>;

  constructor(private router: Router, private http: HttpClient , private fnFunctions: Functions) {
    this.LeerToken();
    this.currentUserSubject = new BehaviorSubject<UsuarioModel>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
   }

  Logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    this.router.navigate(['/authentication/signin']);
    //return of({ success: false });

  }
  public get currentUserValue(): UsuarioModel {
    return this.currentUserSubject.value;
  }


  Login(obj: UsuarioMinModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(Server + '/api/Usuario/Login', obj, httpOptions)
      .pipe(map( resp => {
        if (resp['Token']) {
           this.GuardarToken( resp);
        }
        return resp;
    }));
  }

  private GuardarToken( resp: UsuarioModel): void {
    const dthoy = new Date();
    dthoy.setSeconds( 3600 );
    localStorage.setItem('E', dthoy.getTime().toString());
    localStorage.setItem('currentUser', JSON.stringify(resp));
    this.currentUserSubject.next(resp);
  }

asignaToken(ticket: TicketModel){
  this.currentUserValue.Tickets = [ticket];
  this.currentUserValue.Rol = this.fnFunctions.clasificaRol(ticket);
  localStorage.setItem('currentUser', JSON.stringify(this.currentUserValue));
  this.currentUserSubject.next(this.currentUserValue);
}
  LeerToken(): void {

    if ( localStorage.getItem('T') ) {
      this.strToken = JSON.stringify(localStorage.getItem('T'));
    } else {
      this.strToken = '';
    }

  }

  EstaAutenticado(): boolean {

    if ( this.strToken === '' ) {
      return false;
    }

    const expira = Number(localStorage.getItem('E'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }


  }

}
