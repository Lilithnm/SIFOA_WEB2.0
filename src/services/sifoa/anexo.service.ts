import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnexoModel, GarantiaModel, ReporteBusquedaModel } from '../../models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  strApi = '/api/Anexo';
  strOrden ='/api/Orden';
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

    ObtenerAnexo(BusquedaAnexo: AnexoModel): Observable<AnexoModel> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post<AnexoModel>(this.urlServer + this.strApi + '/Obtener', BusquedaAnexo , HTTPOPTIONS);
    }

    ObtenerAnexos(BusquedaAnexo: AnexoModel): Observable<AnexoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<AnexoModel[]>(this.urlServer + this.strApi + '/ObtenerTodos', BusquedaAnexo , HTTPOPTIONS);
    }

    CrearAnexo(Anexo: AnexoModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<number>(this.urlServer + this.strApi + '/Crear', Anexo , HTTPOPTIONS);
    }

    CanjearAnexo(Anexo: AnexoModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.put<GarantiaModel>(this.urlServer + this.strApi + '/Canjear', Anexo , HTTPOPTIONS);
    }

    ActualizarAnexo(Anexo: AnexoModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.put<number>(this.urlServer + this.strApi + '/Actualizar', Anexo , HTTPOPTIONS);
    }

    AnularCanje(Anexo: AnexoModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.put<number>(this.urlServer + this.strApi + '/AnularCanje', Anexo , HTTPOPTIONS);
    }

    ReporteCanjeados(Busqueda: ReporteBusquedaModel):  Observable<AnexoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<AnexoModel[]>(this.urlServer + this.strApi + '/ReporteCanjeados', Busqueda , HTTPOPTIONS);
    }

    ReporteCanjeadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer   + this.strApi + '/AnexosCanjeadosExcel',busqueda, { responseType: 'blob' });
    }    
    ReporteCanjeadosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/AnexosCanjeadosPDF',busqueda, { responseType: 'blob' });
    }

    ReporteRegistrados(Busqueda: ReporteBusquedaModel):  Observable<AnexoModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<AnexoModel[]>(this.urlServer + this.strApi + '/ReporteRegistrados', Busqueda , HTTPOPTIONS);
    }
    ReporteRegistradosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
   return this.http.post(this.urlServer   + this.strApi + '/AnexosRegistradosExcel',busqueda, { responseType: 'blob' });
    }    
    ReporteRegistradosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/AnexosRegistradosPDF',busqueda, { responseType: 'blob' });
    }

    ImprimeAnexo(Anexo: AnexoModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strOrden + '/ImprimeAnexo', Anexo , { responseType: 'blob' });
    }
  }

