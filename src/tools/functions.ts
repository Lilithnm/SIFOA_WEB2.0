
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Rol, TicketModel } from 'src/models/catalogos';
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

    let rolesSolicitud = [4]; //1
    let rolesCaptura = [5]; //1
    let rolesCoordina = [2];//2
    let rolesAdmin=[1];//3
    let rolesAlmacenista=[3];//3

    let roles: number[]=[];

    roles.push(tickets.Rol.Identificador)


    if(rolesAdmin.some(r=> (roles.includes(r)))){
      return Rol.Admin;
    }
    else if(rolesCoordina.some(r=> (roles.includes(r)))){
      return Rol.Coordinador
    }
    else if(rolesSolicitud.some(r=> (roles.includes(r))) ){
      return Rol.Solicitante
    }
    else if(rolesAlmacenista.some(r=> (roles.includes(r))) ){
      return Rol.Almacenista
    }
    else if(rolesCaptura.some(r=> (roles.includes(r))) ){
      return Rol.Capturista
    }
    return Rol.Todos;
  }

}