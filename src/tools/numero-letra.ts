
import { Injectable } from '@angular/core';
import { BaseModel } from 'src/models/catalogos';
@Injectable({
  providedIn: 'root'
})
export class NumeroLetra {
    

 unidades(num: number): string {
    switch (num) {
      case 1:
        return 'Un';
      case 2:
        return 'Dos';
      case 3:
        return 'Tres';
      case 4:
        return 'Cuatro';
      case 5:
        return 'Cinco';
      case 6:
        return 'Seis';
      case 7:
        return 'Siete';
      case 8:
        return 'Ocho';
      case 9:
        return 'Nueve';
      default:
        return '';
    }
  }
  
   decenasY(strSin: string, numUnidades: number) {
    if (numUnidades > 0) {
      return strSin + ' y ' + this.unidades(numUnidades);
    }
  
    return strSin;
  }
  
   decenas(num: number): string {
    var numDecena = Math.floor(num / 10);
    var numUnidad = num - numDecena * 10;
  
    switch (numDecena) {
      case 1:
        switch (numUnidad) {
          case 0:
            return 'Diez';
          case 1:
            return 'Once';
          case 2:
            return 'Doce';
          case 3:
            return 'Trece';
          case 4:
            return 'Catorce';
          case 5:
            return 'Quince';
          default:
            return 'Dieci' + this.unidades(numUnidad).toLowerCase();
        }
      case 2:
        switch (numUnidad) {
          case 0:
            return 'Veinte';
          default:
            return 'Veinti' + this.unidades(numUnidad).toLowerCase();
        }
      case 3:
        return this.decenasY('Treinta', numUnidad);
      case 4:
        return this.decenasY('Cuarenta', numUnidad);
      case 5:
        return this.decenasY('Cincuenta', numUnidad);
      case 6:
        return this.decenasY('Sesenta', numUnidad);
      case 7:
        return this.decenasY('Setenta', numUnidad);
      case 8:
        return this.decenasY('Ochenta', numUnidad);
      case 9:
        return this.decenasY('Noventa', numUnidad);
      case 0:
        return this.unidades(numUnidad);
      default:
        return '';
    }
  }
  
   centenas(num: number): string {
    var numCentenas = Math.floor(num / 100);
    var numDecenas = num - numCentenas * 100;
  
    switch (numCentenas) {
      case 1:
        if (numDecenas > 0) {
          return 'Ciento ' + this.decenas(numDecenas);
        }
        return 'Cien';
      case 2:
        return 'Doscientos ' + this.decenas(numDecenas);
      case 3:
        return 'Trescientos ' + this.decenas(numDecenas);
      case 4:
        return 'Cuatrocientos ' + this.decenas(numDecenas);
      case 5:
        return 'Quinientos ' + this.decenas(numDecenas);
      case 6:
        return 'Seiscientos ' + this.decenas(numDecenas);
      case 7:
        return 'Setecientos ' + this.decenas(numDecenas);
      case 8:
        return 'Ochocientos ' + this.decenas(numDecenas);
      case 9:
        return 'Novecientos ' + this.decenas(numDecenas);
      default:
        return this.decenas(numDecenas);
    }
  }
  
   seccion(num: number, divisor: number, strSingular:string, strPlural: string): string {
    var numCientos = Math.floor(num / divisor);
    var numResto = num - numCientos * divisor;
  
    var letras = '';
  
    if (numCientos > 0) {
      if (numCientos > 1) {
        letras = this.centenas(numCientos) + ' ' + strPlural;
      } else {
        letras = strSingular;
      }
    }
  
    if (numResto > 0) {
      letras += '';
    }
  
    return letras;
  }
  
   miles(num: number): string {
    var divisor = 1000;
    var numCientos = Math.floor(num / divisor);
    var numResto = num - numCientos * divisor;
    var strMiles = this.seccion(num, divisor, 'Un Mil', 'Mil');
    var strCentenas = this.centenas(numResto);
  
    if (strMiles === '') {
      return strCentenas;
    }
  
    return (strMiles + ' ' + strCentenas).trim();
  }
  
   millones(num: number): string {
    var divisor = 1000000;
    var numCientos = Math.floor(num / divisor);
    var numResto = num - numCientos * divisor;
    var strMillones = this.seccion(num, divisor, 'Un Millón de', 'Millones de');
    var strMiles = this.miles(numResto);
  
    if (strMillones === '') {
      return strMiles;
    }
  
    return (strMillones + ' ' + strMiles).trim();
  }
  

 NumerosALetras(num: number, banco: BaseModel): string {
    let letrasMonedaPluralV= 'Pesos';
    let letrasMonedaSingularV= 'Peso';
    let letrasMonedaCentavoPluralV= '/100 M.N.';
    let letrasMonedaCentavoSingularV= '/100 M.N.';
  
    if(banco){
      if(banco.Identificador== 3){
        letrasMonedaPluralV= 'Dólares';
        letrasMonedaSingularV= 'Dólar';
        letrasMonedaCentavoPluralV= '/100 USD';
        letrasMonedaCentavoSingularV= '/100 USD';
      }
    }
  
    var data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: '',
      letrasMonedaPlural: letrasMonedaPluralV,
      letrasMonedaSingular: letrasMonedaSingularV,
      letrasMonedaCentavoPlural: letrasMonedaCentavoPluralV,
      letrasMonedaCentavoSingular: letrasMonedaCentavoSingularV
    };
  
    if (data.centavos >= 0) {
      data.letrasCentavos = function () {
        if (data.centavos >= 1 && data.centavos <= 9) {
          return '0' + data.centavos + data.letrasMonedaCentavoSingular;
        }
  
        if (data.centavos === 0) {
          return '00' + data.letrasMonedaCentavoSingular;
        }
  
        return data.centavos + data.letrasMonedaCentavoPlural;
      }();
    }
  
    if (data.enteros === 0) {
      return ('Cero ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos).trim();
    }
  
    if (data.enteros === 1) {
      return (this.millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos).trim();
    }
  
    return (this.millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos).trim();
  }
  
}