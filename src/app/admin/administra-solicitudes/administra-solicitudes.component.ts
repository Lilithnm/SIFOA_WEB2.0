import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import * as GC from "@grapecity/spread-sheets";
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SolicitudService } from 'src/services/materiales/solicitud.service';
import { MediaService } from 'src/services/shared/media.service';
import { DatePipe } from '@angular/common';
import { MaterialModel, NotificacionModel, SolicitudMaterialesModel, SolicitudModel } from 'src/models/main';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NotificacionesService } from 'src/services/materiales/notificaciones.service';
import { ExcelService } from 'src/services/materiales/excel.service';
import { MailServce } from 'src/services/shared/mail.service';
@Component({
  selector: 'app-adminsolicitudes-tabla',
  //encapsulation: ViewEncapsulation.None,
  templateUrl: './administra-solicitudes.component.html',
  styleUrls: ['./administra-solicitudes.component.scss'],
})
export class AdministraSolicitudesComponent implements OnInit {


  /////
  ////

  spreadBackColor = 'aliceblue';
  hostStyle = {
    width: '95vw',
    height: '80vh'
  };
  private spread;
  //private excelIO;


  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  
  
  @ViewChild('BuscaAlmacenSw') private BusccaSw!: SwalComponent;

  rows = [];
  newUserImg = 'assets/images/user/user1.jpg';
  data: SolicitudModel[] = [];
  filteredData: SolicitudModel[] = [];
  register?: UntypedFormGroup;
  selectedOption?: string;
  SortType = SortType;
  
  columns=[{ prop: 'name' },{ prop: 'name' },{ prop: 'name' },{ prop: 'name' },{ prop: 'name' },{ prop: 'name' }];
  //listaMateriales:SolicitudMaterialesModel[]=[];  
  materialesSinEx:SolicitudMaterialesModel[]=[];
  solicitudAdmin: SolicitudModel = new SolicitudModel(0);
  nuevaSolicitud: SolicitudModel = new SolicitudModel(0);
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  breadscrums = [
    {
      title: 'Solicitudes',
      items: [],
      active: 'Administrar Solicitudes',
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar, // private modalService: NgbModal
    private router: Router,
    private svcSpinner: NgxSpinnerService,
    private svcSolicitud: SolicitudService,
    private svcExcel: ExcelService,
    private svcMedia: MediaService,
    private svcMail: MailServce,
    private svcNotificaciones: NotificacionesService,
    private datePipe: DatePipe,
  ) {
     this.spread = new GC.Spread.Sheets.Workbook();
  //  this.excelIO = new Excel.IO();
  }
  ngOnInit() {
      this.obtenerSolicitudes();
  
  }

  deleteRow(row: SolicitudModel) {
    Swal.fire({
      title: '¿Desea eliminar la solicitud No. '+row.Identificador+' ?',
      text:'Ésta acción no podrá deshacerse',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {        
          row.Estatus = 0;
          this.svcSolicitud.ActualizarSolicitud(row).subscribe(respuesta => {
          //  this.svcSpinner.hide();          
            this.obtenerSolicitudes()      
              Swal.fire('Eliminada', '', 'success')
          }, () => { }, () => {
          });
        }
    })
  }
  getEstado(row: SolicitudModel){
    if(row.Estado.Identificador==2){
      return "Recibida"
    }else{
      return row.Estado.Descripcion
    }
  }

  filterDatatable(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const colsAmt = this.data.length;

    this.data = this.filteredData.filter((item) => {
        const accumulator = (currentTerm: any, key: any) => {
          return this.objAnidadoCheck(currentTerm, item, key);
        };
        const dataStr = Object.keys(item).reduce(accumulator, '').toLowerCase();
        // se transforma convirtiendolo a minusculas y quitando los espacios
        const transformedFilter = val.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  objAnidadoCheck(search: any, data: any, key: any): any {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.objAnidadoCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }



  getId(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['bg-red'],
    });
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  
  obtieneEstadoSolicitud(elemento: any): string{
    switch(elemento.Estado){
      case 1:
        return "Registrado"
      case 2:
        return "Canjeado"
      default:
        return ""
   }
  }

  ImprimeSolicitud(Solicitud: SolicitudModel):void{
    let solicitudTemp = new SolicitudModel(0);
    solicitudTemp = Object.assign({}, Solicitud);
    this.svcSpinner.show()
    solicitudTemp.FechaCaptura=this.formatFecha(solicitudTemp.FechaCaptura)
    solicitudTemp.FechaSolicitud=this.formatFecha(solicitudTemp.FechaSolicitud)
    solicitudTemp.FechaProceso=this.formatFecha(solicitudTemp.FechaProceso)
    solicitudTemp.FechaLibera=this.formatFecha(solicitudTemp.FechaLibera)
    solicitudTemp.FechaEntrega=this.formatFecha(Solicitud.FechaEntrega)

    this.svcSolicitud.ImprimeSolicitud(solicitudTemp).subscribe((data) => {
      this.svcMedia.openFile(data);
      this.svcMedia.downloadFile(data, 'Solicitud'+Solicitud.Identificador+'.pdf');
      this.svcSpinner.hide();
    }, error => console.log('Error downloading the file.'),
    () => {
  });       
}


  agregarSolicitud(): void {     
    this.router.navigate(['/solicitante/nueva-solicitud']);
  }

 descargaExcel(solicitud: SolicitudModel){
  this.svcSpinner.show()
 

this.svcExcel.OrdenAlmacenSap(solicitud).subscribe({
  next: (res) => {
    if (res) {
      this.svcMedia.downloadFileXls(res, 'Materiales - Sol'+solicitud.Identificador);
      this.svcSpinner.hide()
    } 
  },
  error: (error) => {
  },
});
this.svcSpinner.hide()


 }



  surteSol(row: SolicitudModel){
    this.solicitudAdmin = row;
    this.BusccaSw.fire()
  }

  obtenerSolicitudes(){
    let nuevaSolicitud = new SolicitudModel(0);
    this.svcSpinner.show();
      this.svcSolicitud.ObtenerTodas().subscribe(respuesta => {
          this.svcSpinner.hide();          
          this.data = respuesta;
          this.filteredData = respuesta;
          
        }, () => { }, () => {
        });


  }

  formatFecha(fecha:any){
    if(fecha!=null){      
      return this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm');
    }else{
      return "";
    }
  }

  calculaTiempo(row:SolicitudModel){
    if(row.FechaLibera && row.Estado.Identificador==4){

        var date1 = new Date();
        var date2 = new Date(row.FechaLibera);
    
        if(date1.getDate()!=date2.getDate()||date1.getMonth()!=date2.getMonth()){
          var diff = Math.abs(date1.getTime() - date2.getTime());
          var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
          return diffDays+ " días"; 
        }
        else{
          return "";
        }

 
      }
    
   else{
      return "";
    }
  }

  
  procesaSolicitud(){

    function insuficente(material:SolicitudMaterialesModel) {
      return (material.EstatusMaterial.Identificador ==3||material.EstatusMaterial.Identificador ==4);
    }
    this.materialesSinEx=[];
    this.materialesSinEx = this.solicitudAdmin.Materiales.filter(insuficente);

    let justifica = this.solicitudAdmin.Materiales.find((item) => {   return    item.EstatusMaterial.Identificador == 5;    } );

    this.solicitudAdmin.Estado.Identificador=3;


    if(this.materialesSinEx.length>0){
    
      this.solicitudAdmin.Estado.Identificador=9;
     
      }
      

    this.actualizaSolicitud()

    
    if(this.materialesSinEx.length>0){

      this.materialesSinEx.forEach(material => {
          material.CantidadSolicitada = material.CantidadSolicitada - material.CantidadSurtida;
          material.CantidadSurtida=0;
          material.Identificador = 0;
          material.IdentificadorSolicitud = this.solicitudAdmin.Identificador;
          material.EstatusMaterial.Identificador = 1;     
      });
     
    this.guardaSolicitudSI(this.solicitudAdmin, this.materialesSinEx)
    }
    

    let nuevaNoti = new NotificacionModel(0);

    if(justifica!=undefined){
      nuevaNoti.Texto="Algun(os) material(es) de la solicitud "+this.solicitudAdmin.Identificador+" requieren justificación"
      nuevaNoti.Centro = this.solicitudAdmin.CentroSolicita;
      nuevaNoti.UsuarioID = this.solicitudAdmin.UsuarioSolicita.Identificador;
      nuevaNoti.Tipo = 1;
      nuevaNoti.Icono = "arrow_right_alt";

    }else{
      nuevaNoti.Texto="La solicitud "+this.solicitudAdmin.Identificador+" se encuentra en proceso"
      nuevaNoti.Centro = this.solicitudAdmin.CentroSolicita;
      nuevaNoti.UsuarioID = this.solicitudAdmin.UsuarioSolicita.Identificador;
      nuevaNoti.Tipo = 1;
      nuevaNoti.Icono = "arrow_right_alt";

    }

    this.svcNotificaciones.CrearNotificacion(nuevaNoti).subscribe(respuesta => {
    }, () => { }, () => {
    });        
    Swal.fire({
      icon: 'success',
      title: 'Guardado',            
    }).then((result) => {         
      this.obtenerSolicitudes()     
    })
     
  }
   guardaSolicitudSI(solicitudOld: SolicitudModel, matSinExistencia: SolicitudMaterialesModel[]){

    this.nuevaSolicitud = solicitudOld;
    this.nuevaSolicitud.Observaciones =  "Solicitud generada automáticamente a partir der los faltantes de la solicitud "+ solicitudOld.Identificador;
    this.nuevaSolicitud.IdentificadorOrigen=solicitudOld.Identificador;
    this.nuevaSolicitud.Materiales = matSinExistencia;
    this.nuevaSolicitud.Estado.Identificador = 7;
    this.nuevaSolicitud.Identificador=0;

    
        this.svcSolicitud.CrearSolicitud(this.nuevaSolicitud).subscribe(respuesta => {               
   
        }, () => { }, () => {
        });

        Swal.fire({
          icon: 'success',
          title: 'Se creó una nueva solicitud con el material faltante',            
        })

  }



  actualizaSolicitud(){
    
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.solicitudAdmin.Estado.Identificador
    this.solicitudAdmin.FechaProceso = localISOTime
    this.svcSpinner.show();    
    this.svcSolicitud.ActualizarSolicitud(this.solicitudAdmin).subscribe(respuesta => {
      this.svcSpinner.hide();
                  
      
    }, () => { }, () => {
    });
  }



  listaEntrega(row: SolicitudModel){
    this.solicitudAdmin = row;
    Swal.fire({
      title: '¿Desea marcar la solicitud No. '+row.Identificador+' como lista para entregada',
      text:'El solicitante será notificado',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
     if (result.isConfirmed) {      

    
        
      this.solicitudAdmin.Estado.Identificador=4;
    
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
     
      this.solicitudAdmin.FechaLibera = localISOTime;
        this.svcSpinner.show();    
    
          this.svcSolicitud.ActualizarSolicitud(this.solicitudAdmin).subscribe(respuesta => {
            this.svcSpinner.hide();
                  
            Swal.fire({
              icon: 'success',
              title: 'Guardado',            
            }).then((result) => {         
              this.obtenerSolicitudes()     
            })        
            
          }, () => { }, () => {
          });

          let nuevaNoti = new NotificacionModel(0);
          nuevaNoti.Texto="La solicitud "+this.solicitudAdmin.Identificador+" se encuentra lista para entrega;"
          nuevaNoti.Centro = this.solicitudAdmin.CentroSolicita;
          nuevaNoti.Tipo = 1;
          nuevaNoti.UsuarioID = this.solicitudAdmin.UsuarioSolicita.Identificador;

          nuevaNoti.Icono = "arrow_right_alt";
  
          this.svcNotificaciones.CrearNotificacion(nuevaNoti).subscribe(respuesta => {
          }, () => { }, () => {
          });         

                

      if(row.UsuarioSolicita.Correo!=''){
        this.svcMail.correoCambia(row).subscribe(respuesta => {
        }, () => { }, () => {
        });        
      } else{
        Swal.fire({
          icon: 'info',
          title: 'El usuario no tiene un correo capturado, solo se notificará en sistema',            
        })
      }
        }
    })
  
  }

  
  recordatorio(row: SolicitudModel){

    this.solicitudAdmin = row;
    Swal.fire({
      title: '¿Desea enviar un recordatorio al centro de trabajo por la  solicitud No. '+row.Identificador+'?',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
     if (result.isConfirmed) {     
      if(row.UsuarioSolicita.Correo!=''){
        this.svcMail.enviaRecordatorio(row).subscribe(respuesta => {
        }, () => { }, () => {
        });        
      } else{
        Swal.fire({
          icon: 'info',
          title: 'El usuario no tiene un correo capturado',            
        })
      }
    
   
      let nuevaNoti = new NotificacionModel(0);
      nuevaNoti.Texto="Se le recuerda que la solicitud "+this.solicitudAdmin.Identificador+" se encuentra lista para entrega;"
      nuevaNoti.Centro = this.solicitudAdmin.CentroSolicita;
      nuevaNoti.Tipo = 1;
      nuevaNoti.UsuarioID = this.solicitudAdmin.UsuarioSolicita.Identificador;
  
      nuevaNoti.Icono = "arrow_right_alt";
  
      this.svcNotificaciones.CrearNotificacion(nuevaNoti).subscribe(respuesta => {
      }, () => { }, () => {
      }); 


      Swal.fire({
        icon: 'success',
        title: 'Notificación Enviada',            
      })

        }
    })

        
  }


  descargaArchivo(row: SolicitudModel){

  }
  entregado(row: SolicitudModel){
    this.solicitudAdmin = row;
    Swal.fire({
      title: '¿Desea marcar la solicitud No. '+row.Identificador+' como entregada?',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
     if (result.isConfirmed) {      
      
      this.solicitudAdmin.Estado.Identificador=5;
    
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
     
      this.solicitudAdmin.FechaEntrega = localISOTime;
        this.svcSpinner.show();    
    
          this.svcSolicitud.ActualizarSolicitud(this.solicitudAdmin).subscribe(respuesta => {
            this.svcSpinner.hide();
                  
            Swal.fire({
              icon: 'success',
              title: 'Guardado',            
            }).then((result) => {         
              this.obtenerSolicitudes()     
            })        
            
          }, () => { }, () => {
          });


          let nuevaNoti = new NotificacionModel(0);
          nuevaNoti.Texto="La solicitud "+this.solicitudAdmin.Identificador+" ha sido entregada;"
          nuevaNoti.Centro = this.solicitudAdmin.CentroSolicita;
          nuevaNoti.UsuarioID = this.solicitudAdmin.UsuarioSolicita.Identificador;
          nuevaNoti.Tipo = 2;
          nuevaNoti.Icono = "arrow_right_alt";
  
          this.svcNotificaciones.CrearNotificacion(nuevaNoti).subscribe(respuesta => {
          }, () => { }, () => {
          });         

          


        }
    })
  }
  cancela(row: SolicitudModel) {
    Swal.fire({
      title: '¿Desea cancelar la solicitud No. '+row.Identificador+' ?',
      text:'Ésta solicitud fue generada automáticamente por los faltantes de la solcitud No.'+row.IdentificadorOrigen+', si ya no requiere los materiales incluidos en ésta solicitud puede cancelarla',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {        
          row.Estado.Identificador = 11;
          this.svcSolicitud.ActualizarSolicitud(row).subscribe(respuesta => {
          //  this.svcSpinner.hide();          
            this.obtenerSolicitudes()      
              Swal.fire('Cancelada', '', 'success')
          }, () => { }, () => {
          });
        }
    })
  }

}