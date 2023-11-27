import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteBusquedaModel, ReporteResultModel } from '../../models/main';

const HTTPOPTIONS = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  strApi = '/api/Reportes'; 
  urlServer:string|null = "";

  constructor(private http: HttpClient) { 
  }

    ReporteadorExcel(busqueda:ReporteBusquedaModel, tipo: number): Observable<Blob> {
        return this.http.post(this.urlServer + this.strApi + '/ReporteadorExcel/'+tipo ,busqueda, { responseType: 'blob' });
      }
    
    Reporteador(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/Reporteador' ,busqueda,HTTPOPTIONS);
    }
    
    ReporteaExpedidos(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteExpedidos' ,busqueda,HTTPOPTIONS);
    }
    
    ExpedidosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ExpedidosExcel',busqueda, { responseType: 'blob' });
    }

    ExpedidosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteExpedidosPDF',busqueda, { responseType: 'blob' });
    }

    /**/ 
    ReporteCompensados(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteCompensados' ,busqueda,HTTPOPTIONS);
    }
    CompensadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/CompensadosExcel',busqueda, { responseType: 'blob' });
    }
    ReporteCompensadosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteCompensadosPDF',busqueda, { responseType: 'blob' });
    }
    /**/ 
    ReporteEndosados(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteEndosados' ,busqueda,HTTPOPTIONS);
    }
    EndosadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/EndosadosExcel',busqueda, { responseType: 'blob' });
    }
    ReporteEndosadosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteEndosadosPDF',busqueda, { responseType: 'blob' });
    }   
    /**/ 
    ReporteLiberados(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteLiberados' ,busqueda,HTTPOPTIONS);
    }        
    LiberadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/LiberadosExcel',busqueda, { responseType: 'blob' });
    }    
    ReporteLiberadosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteLiberadosPDF',busqueda, { responseType: 'blob' });
    }
    /**/ 
    ReporteFinalizados(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteFinalizados' ,busqueda,HTTPOPTIONS);
    }  
    FinalizadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/FinalizadosExcel',busqueda, { responseType: 'blob' });
    }  
    ReporteFinalizadosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteFinalizadosPDF',busqueda, { responseType: 'blob' });
    }    
    
    /**/ 
    ReporteConciliados(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteConciliados' ,busqueda,HTTPOPTIONS);
    }        
    ConciliadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ConciliadossExcel',busqueda, { responseType: 'blob' });
    }
    ReporteConciliadosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteConciliadosPDF',busqueda, { responseType: 'blob' });
    }    
    /**/
    ReporteDepositos(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteDepositosFecha' ,busqueda,HTTPOPTIONS);
    }  
    ReporteDepositosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteDepositosExcel',busqueda, { responseType: 'blob' });
    }
    
    ReporteDepositosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteDepositosPDF',busqueda, { responseType: 'blob' });
    }    
    AnexosCanjeadosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer  + '/api/Anexo/AnexosCanjeadosExcel',busqueda, { responseType: 'blob' });
    }
    AnexosRegistradosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer  + '/api/Anexo/AnexosRegistradosExcel',busqueda, { responseType: 'blob' });
    }

    ReporteMigrados(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteAnMigrados' ,busqueda,HTTPOPTIONS);
    }
    ReporteMigradosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer   + this.strApi + '/ReporteAnMigradosExcel',busqueda, { responseType: 'blob' });
    }    
    ReporteMigradosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteMigradosPDF',busqueda, { responseType: 'blob' });
    }

    ReporteDevueltos(busqueda:ReporteBusquedaModel): Observable<ReporteResultModel[]> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post<ReporteResultModel[]>(this.urlServer + this.strApi + '/ReporteDevueltos' ,busqueda,HTTPOPTIONS);
    }
    ReporteDevueltosExcel(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer   + this.strApi + '/ReporteDevueltosExcel',busqueda, { responseType: 'blob' });
    }    
    ReporteDevueltosPDF(busqueda:ReporteBusquedaModel): Observable<Blob> {
    this.urlServer = localStorage.getItem('Server');
    return this.http.post(this.urlServer + this.strApi + '/ReporteDevueltosPDF',busqueda, { responseType: 'blob' });
    }


    

  
}
