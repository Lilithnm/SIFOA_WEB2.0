
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Rol, TicketModel } from 'src/models/modelos';
@Injectable({
  providedIn: 'root'
})
export class Functions {

  CambiarFecha(fecha: string, tipo: number): string {
    let fechaCambiada: string;
    const fechaSplit = fecha.split('T');
    if (fechaSplit.length === 2) {
      const horaSplit = fechaSplit[1].split(':');
      const fechaDes = fechaSplit[0].split('-');
      if (tipo === 1) {
        fechaCambiada = fechaSplit[0] + 'T' + horaSplit[0] + ':' + horaSplit[1];
      } else if (tipo === 2) {
        if (fechaSplit[1] === '00:00:00') {
          fechaCambiada = fechaDes[2] + '/' + fechaDes[1] + '/' + fechaDes[0]
        } else {
          fechaCambiada = fechaDes[2] + '/' + fechaDes[1] + '/' + fechaDes[0] + ' ' + horaSplit[0] + ':' + horaSplit[1];
        }
      } else {
        fechaCambiada = fechaSplit[0] + ' ' + horaSplit[0] + ':' + horaSplit[1];
      }
    } else {
      fechaCambiada = fechaSplit[0];
    }
    return fechaCambiada;
  }

  ordenarFecha(fecha: string, tipo: number): string
  {
    let fechaCambiada: string;
    if (tipo === 1){
      const fechaDes =  fecha.split('-');
      return  fechaCambiada = fechaDes[2] + '/' + fechaDes[1] + '/' + fechaDes[0];
    } else {
      const fechaDes =  fecha.split('/');
      if(fechaDes.length > 1)
      {
        return  fechaCambiada = fechaDes[2] + '-' + fechaDes[1] + '-' + fechaDes[0];
      }
      else {
        return fecha;
      }
    }
  }

  public encrypt(model: any): string {
    try {
      const plainModel = model.toString();
      const encryptionKey = CryptoJS.enc.Utf8.parse('S3rv1d0rAldebqrqn2021');
      const salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); // this is the byte array UzNydjFkMHJBbGRlYnFycW4yMDIx
      const iterations = 1000;
      const keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, {
        keySize: 256 / 32 + 128 / 32,
        iterations,
        hasher: CryptoJS.algo.SHA1
      });
      const hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
      const key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
      const iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
      const encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(plainModel), key, { iv }).toString();
      return encryptedStr;
    } catch (ex) {
      console.log(ex);
      return '';
    }
  }

  // MANDAR EN BASE64 y encriptar igual la contra
  public decrypt64Encrypt(model: any): string {

    const dec = atob(this.verficarLargo(model));
    return this.encrypt(dec);
  }

  public encryptMd5Encrypt(model: any): string {
    const md5 = CryptoJS.MD5(model).toString();
    return this.encrypt(md5);
  }

  public Md5Encrypt(model: any): string {
    const md5 = CryptoJS.MD5(model).toString();
    return md5;
  }  
  public Encrypt(model: any): string {
    return (this.encrypt(model)).replace('/','').replace('=','');
  }

  public verficarLargo(val: string): string {
    
    let cadena = '';
    if (val) {
      const faltan = val.length % 4;
      switch (faltan) {
        case 0:
          cadena = val;
          break;
        case 2:
          cadena = val + '==';
          break;
        case 3:
          cadena = val + '=';
          break;
      }
    }
    return cadena;
  }

  public clasificaRol(tickets: TicketModel): Rol{

   /* export enum Rol {
      Administrador = "Administrador",
      Juez =  "Juez", 
      Secretario = "Secretario",
      Oficial = "Oficial Judicial",
      Actuarios = "Central de Actuarios",
      Oficialia = "Oficialia de Partes",
      Auditor = "Auditor",
      Visitador = "Visitador",
      JefeUnidad = "Jefe de Unidad de Causa y Gestión",
      Gestion = "Gestión",
      ESala = "Encargado de Sala"    
    }*/


    let rolesAdmin=[6];
    let rolesJuez = [7];
    let rolesSecretario = [13];
    let rolesOficial = [5];
    let rolesActuarios = [65];
    let rolesOficialia =[67];
    let rolesAuditor=[64];
    let rolesVisitador =[52];
    let rolesJefeUnidad =[15];
    let rolesGestion =[17];
    let rolesESala =[8];


    let roles: number[]=[];

    roles.push(tickets.Rol.Identificador)


    if(rolesAdmin.some(r=> (roles.includes(r)))){
      return Rol.Administrador;
    }
    else if(rolesJuez.some(r=> (roles.includes(r)))){
      return Rol.Juez
    }
    else if(rolesSecretario.some(r=> (roles.includes(r))) ){
      return Rol.Secretario
    }
    else if(rolesOficial.some(r=> (roles.includes(r))) ){
      return Rol.Oficial
    }
    else if(rolesActuarios.some(r=> (roles.includes(r))) ){
      return Rol.Actuarios
    }
    else if(rolesOficialia.some(r=> (roles.includes(r))) ){
      return Rol.Oficialia
    }
    else if(rolesAuditor.some(r=> (roles.includes(r))) ){
      return Rol.Auditor
    }
    else if(rolesVisitador.some(r=> (roles.includes(r))) ){
      return Rol.Visitador
    }
    else if(rolesJefeUnidad.some(r=> (roles.includes(r))) ){
      return Rol.JefeUnidad
    }
    else if(rolesGestion.some(r=> (roles.includes(r))) ){
      return Rol.Gestion
    }
    return Rol.Oficial
  }

}