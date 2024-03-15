import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GarantiaModel } from '../../models/main';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class GarantiaService extends UnsubscribeOnDestroyAdapter {

  strApi = '/api/Garantia';
  strOrden ='/api/Orden';  
  urlServer:string|null = "";
    isTblLoading = true;
    dataChange: BehaviorSubject<GarantiaModel[]> = new BehaviorSubject<GarantiaModel[]>([]);
    // Temporarily stores data from dialogs
    dialogData!: GarantiaModel;
    constructor(private http: HttpClient) {
      super();
      
    }

    get data(): GarantiaModel[] {
      return this.dataChange.value;
    }
    getDialogData() {
      return this.dialogData;
    }


  ObtenerGarantia(BusquedaGarantia: GarantiaModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel>(this.urlServer + this.strApi + '/Obtener', BusquedaGarantia , HTTPOPTIONS);
  }

  ObtenerGarantias(BusquedaGarantia: GarantiaModel): void {
    this.urlServer = localStorage.getItem('Server');
    this.subs.sink =   this.http.post<GarantiaModel[]>(this.urlServer + this.strApi + '/ObtenerTodas', BusquedaGarantia , HTTPOPTIONS).subscribe({
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

  ObtenerOrdenGarantia(BusquedaGarantia: GarantiaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post(this.urlServer + this.strOrden + '/OrdenGarantia', BusquedaGarantia , { responseType: 'blob' });
  }

  CrearGarantia(Garantia: GarantiaModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel>(this.urlServer + this.strApi + '/Crear', Garantia , HTTPOPTIONS);
  }

  ActualizarGarantia(Garantia: GarantiaModel): Observable<number> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.put<number>(this.urlServer + this.strApi + '/Actualizar', Garantia , HTTPOPTIONS);
  }

  ObtieneDesdeAnexo(Garantia: GarantiaModel): Observable<GarantiaModel> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel>(this.urlServer + this.strApi + '/ObtenerDesdeAnexo', Garantia , HTTPOPTIONS);
  }

  ObtenerPorTransferencia(BusquedaGarantia: GarantiaModel): Observable<GarantiaModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return  this.http.post<GarantiaModel[]>(this.urlServer + this.strApi + '/ObtenerPorTransferencia', BusquedaGarantia , HTTPOPTIONS);
  }


  

}
