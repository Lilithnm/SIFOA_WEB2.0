import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

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
import { NotificacionModel, SolicitudModel } from 'src/models/main';
import { CentrosModel } from 'src/models/generales';
import { parseGeoJSON } from 'echarts';
import { NotificacionesService } from 'src/services/materiales/notificaciones.service';
import { AutenticacionService } from 'src/services/shared/autenticacion.service';
import { UsuarioModel } from 'src/models/catalogos';
@Component({
  selector: 'app-solicitudes-tabla',
  templateUrl: './solicitudes-tabla.component.html',
  styleUrls: ['./solicitudes-tabla.component.scss'],
})
export class SolicitudesTablaComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  rows = [];
  selectedRowData?: selectRowInterface;
  newUserImg = 'assets/images/user/user1.jpg';
  data: SolicitudModel[] = [];
  filteredData: SolicitudModel[] = [];
  register?: UntypedFormGroup;
  selectedOption?: string;  
  SortType = SortType;
  periodo: number
  usuario:UsuarioModel = new UsuarioModel(0);
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  breadscrums = [
    {
      title: 'Solicitudes',
      items: [],
      active: 'Lista de solicitudes',
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar, // private modalService: NgbModal
    private router: Router,
    private svcSpinner: NgxSpinnerService,
    private svcSolicitud: SolicitudService,
    private svcNotificaciones: NotificacionesService,
    private svcAuth: AutenticacionService,
    private svcMedia: MediaService,
    private datePipe: DatePipe,
  ) {
    let perstr = localStorage.getItem('Periodo');
    this.periodo= parseInt(perstr!=null?perstr:'')    

    this.usuario = this.svcAuth.currentUserValue;
    console.log(this.usuario)
  }
  ngOnInit() {
      this.obtenerSolicitudes();

    this.register = this.fb.group({
      id: [''],
      img: [''],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: [''],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      address: [''],
    });

    
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
  cancela(row: SolicitudModel) {
    Swal.fire({
      title: '¿Desea cancelar la solicitud No. '+row.Identificador+' ?',
      text:'Ésta solicitud fue generada automáticamente por la solcitud No.'+row.IdentificadorOrigen+', si ya no requiere los materiales incluidos en ésta solicitud puede cancelarla',
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
    if(this.periodo == 0){
      Swal.fire('Periodo cerrado', 'El periodo de solicitudes se ha cerrado', 'info')
    }else{
      this.router.navigate(['/solicitante/nueva-solicitud']);
    }
    
  }


  EditarSolicitud():void{/*
    this.svcSpinner.show();
    this.modSolicitud.FechaCaptura = new Date().toISOString().split('T')[0];
    this.svcSolicitudes.ActualizarSolicitud(this.modSolicitud).pipe(takeUntil(this.destroy$)).subscribe(SolicitudId => {
      if (SolicitudId) {
        this.inicializar();
      }
      swal.fire({
        title: 'Éxito',
        text: 'Se edito el Solicitud correctamente.',
        icon: 'success'
      });
    }, errResponse => {
      this.svcSpinner.hide();
    }, () => {
      this.svcSpinner.hide();
    }); */
  }



  obtenerSolicitudes(){
    let nuevaSolicitud = new SolicitudModel(0);
    //this.svcSpinner.show();
      this.svcSolicitud.ObtenerSolicitudes(nuevaSolicitud).subscribe(respuesta => {
          this.data = respuesta;
          this.filteredData = respuesta;
        }, () => { }, () => {
        });


  }

  enviarSolicitud(row: SolicitudModel){
    Swal.fire({
      title: '¿Desea enviar la solicitud No. '+row.Identificador+' ?',
      text:'Una vez enviada, no podrá hacer ningún cambio',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {      
      row.Estado.Identificador = 2;   
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
     
          row.FechaSolicitud = localISOTime

          let nuevaNoti = new NotificacionModel(0);
          nuevaNoti.Texto="Nueva Solicitud";
          nuevaNoti.Centro = row.CentroSolicita;
          nuevaNoti.Tipo = 2;
          nuevaNoti.Icono = "arrow_right_alt";

          this.svcNotificaciones.CrearNotificacion(nuevaNoti).subscribe(respuesta => {
            this.svcSpinner.hide();  
            this.obtenerSolicitudes()      
            Swal.fire('Enviada', '', 'success')
          }, () => { }, () => {
          });         

      
          this.svcSolicitud.ActualizarSolicitud(row).subscribe(respuesta => {
            this.svcSpinner.hide();  
            this.obtenerSolicitudes()      
            Swal.fire('Enviada', '', 'success')
          }, () => { }, () => {
          });         


        }
    })
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

}
export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}


