import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnexoModel, GarantiaModel, ReporteBusquedaModel } from '../../models/main';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AnexoService extends UnsubscribeOnDestroyAdapter {

  strApi = '/api/Anexo';
  strOrden ='/api/Orden';
  urlServer:string|null = "";
    isTblLoading = true;
    dataChange: BehaviorSubject<AnexoModel[]> = new BehaviorSubject<AnexoModel[]>([]);
    // Temporarily stores data from dialogs
    dialogData!: AnexoModel;
    constructor(private http: HttpClient) {
      super();
      
    }

    get data(): AnexoModel[] {
      return this.dataChange.value;
    }
    getDialogData() {
      return this.dialogData;
    }


    ObtenerAnexo(BusquedaAnexo: AnexoModel): Observable<AnexoModel> {
      this.urlServer = localStorage.getItem('Server');
      return this.http.post<AnexoModel>(this.urlServer + this.strApi + '/Obtener', BusquedaAnexo , HTTPOPTIONS);
    }

    ObtenerAnexos(BusquedaAnexo: AnexoModel): void {
    this.urlServer = localStorage.getItem('Server');
      this.subs.sink = this.http.post<AnexoModel[]>(this.urlServer + this.strApi + '/ObtenerTodos', BusquedaAnexo ).subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      }); 

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

