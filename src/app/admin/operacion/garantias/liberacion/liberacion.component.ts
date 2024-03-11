import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal, { SweetAlertResult } from 'sweetalert2';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { map, startWith } from 'rxjs/operators';
import { ANIMATIONS } from '../../../tools/animations';
import { BeneficiarioModel, DevolucionModel, GarantiaModel, ReporteBusquedaModel } from '../../../models/main';
import { AccionesModel, InformacionTablaModel } from 'src/app/models/modelos';
import { GeneralesModel } from 'src/app/models/generales';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CentrosService } from 'src/app/services/sifoa/centros.service';
import { BaseModel, CentrosCostoModel, CentrosModel, MunicipioModel } from 'src/app/models/catalogos';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Functions } from 'src/app/tools/functions';
import { DevolucionService } from 'src/app/services/sifoa/devolucion.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';
import { LiberarConfirmComponent } from 'src/app/shared/liberar-confirm/liberar-confirm.component';

@Component({
  selector: 'app-liberacion',
  templateUrl: './liberacion.component.html',
  styleUrls: ['./liberacion.component.scss'],
  animations: ANIMATIONS
})
export class LiberacionComponent {
  
  @ViewChild('ciudad', {static: false}) ciudadInput!: MatInput;

  @ViewChild('juzgado', {static: false}) juzgadoInput!: MatInput;

  destroy$: Subject<boolean> = new Subject<boolean>();
  modGarantia = new GarantiaModel();
  arrData: GarantiaModel[] = [];
  arrGarantias: GarantiaModel[] = [];
  modEncabezados = new InformacionTablaModel();
  generales!: GeneralesModel;
  isValid!: boolean;
  public sistemas: BaseModel[]=[];
  isMode: number = 1;
  VaGuardar!: boolean;
  
  arrMunicipios: MunicipioModel[]=[];

  displayedColumns: string[] = ['select', 'folio', 'beneficiario', 'monto','identificacion','vigencia','expediente','fechaendoso'];
  dataSource = new MatTableDataSource<DevolucionModel>();
  selection = new SelectionModel<DevolucionModel>(false, []);

  listCentros: CentrosModel[] = [];
  listDevoluciones:DevolucionModel[]= []

  centrosSync!: Observable<CentrosModel[]>;
  juzgadoSelect: number=0;
  centroBusq: string="";

  permiso!:boolean;

  ciudades: BaseModel[] = [];
  ciudadesSync!: Observable<BaseModel[]>;
  seleccionarTodos = false;

  busqueda: ReporteBusquedaModel= new ReporteBusquedaModel();

  constructor(private toolFunctions: Functions, 
    public dialog: MatDialog,  private svcSpinner: NgxSpinnerService,  private svcDevo: DevolucionService,  private datePipe: DatePipe) {
              
    if (localStorage.getItem('Generales'))
    {
      this.generales = JSON.parse(localStorage.Generales);
    }
    this.obtenerEndosos()

    this.permiso = this.toolFunctions.tienePermiso(6)      

   }
  
   formatFecha(fecha:string){
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }

  obtenerEndosos(){
    this.busqueda.Juzgado = this.generales.Expediente.Centro.Identificador.toString();
    this.busqueda.FechaFin = '2090-01-01';
    this.busqueda.FechaInicio='1990-01-01';
    this.svcDevo.ObtenerListaLiberacion(this.busqueda).pipe(takeUntil(this.destroy$)).subscribe(resultado => {
       this.dataSource = new MatTableDataSource<DevolucionModel>(resultado);
      }, errResponse => {
        this.svcSpinner.hide();      
      }, () => {
        this.svcSpinner.hide();      
      });
   }


   obtieneBeneficiario(devolucion: DevolucionModel){
    if(devolucion.Tipo ==2){
      return "Poder Judicial"
    }
    else{
      if(devolucion.Beneficiarios?.length>0){
        return devolucion.Beneficiarios[0].Personaje.Nombre+" "+devolucion.Beneficiarios[0].Personaje.Paterno+" "+devolucion.Beneficiarios[0].Personaje.Materno
      }else{
        return "Multa Ordinaria"
      }
   }
  }

  obtieneIdentificacion(devolucion: DevolucionModel){
    if(devolucion.Tipo ==2){
      return "NA"
    }
    else{
      if(devolucion.Beneficiarios?.length>0){
        return devolucion.Beneficiarios[0].TipoIdentificacion
      }else{
        return "NA"
      }
   }
  }
  obtieneVigencia(devolucion: DevolucionModel){
    if(devolucion.Tipo ==2){
      return "NA"
    }
    else{
      if(devolucion.Beneficiarios?.length>0){
        return this.formatFecha(devolucion.Beneficiarios[0].Vigencia)
      }else{
        return "NA"
      }
   }
  }

   getEstado(Estado: number){
    switch(Estado){
      case 1:
        return "Expedida";
      break;
      case 2:
        return "Compensada";
      break;
      case 3:
        return "Endosada";
      break;
      case 4:
        return "Liberada";
      break;
      case 5:
        return "Finalizada";
      break;
    }
   }

   transferible(EsTransferible:number){
      if(EsTransferible ==1){
        return true
      }else{
        return false
      }
   }
   reactivada(devolucion: DevolucionModel){
    return devolucion.Reactivaciones>0;
   }
   getTooltip(devolucion: DevolucionModel){
    if(devolucion.Reactivaciones>0)
      return  "Devolución reactivada";
    else
      return "";
   }
   libera(){   
    
      let devolucion = this.limpiaSeleccionados()[0]

      /////////*************///////////////// */

      if(devolucion.Tipo == 1){
          
            this.dialog
            .open(LiberarConfirmComponent, {
                data: {Beneficiarios: devolucion.ListaCoincidencias}
              })
              .afterClosed()
              .subscribe((confirmado: Boolean) => {
                if (confirmado) {        
                  this.svcSpinner.show();      
                  this.svcDevo.LiberacionMasiva(this.limpiaSeleccionados()).pipe(takeUntil(this.destroy$)).subscribe(resultado => {
                      this.obtenerEndosos()
                      swal.fire({
                        title: 'Liberado',
                        text: "Endoso liberado correctamente",
                        icon: 'success'});
                   }, errResponse => {
                     this.svcSpinner.hide();      
                   }, () => {
                     this.svcSpinner.hide();      
                   });
                } 
              });

        }else{
          
        this.dialog
        .open(ModalConfirmComponent, {
          data: {Title: 'Liberar', Text: '¿Desea liberar la devolución?'}
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          if (confirmado) {        
            this.svcSpinner.show();      
            this.svcDevo.LiberacionMasiva(this.limpiaSeleccionados()).pipe(takeUntil(this.destroy$)).subscribe(resultado => {
                this.obtenerEndosos()
                swal.fire({
                  title: 'Liberado',
                  text: "Endoso liberado correctamente",
                  icon: 'success'});
             }, errResponse => {
               this.svcSpinner.hide();      
             }, () => {
               this.svcSpinner.hide();      
             });
          } 
        });


        }

    
   }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  limpiaSeleccionados(){
      this.listDevoluciones = this.selection.selected;
      return this.listDevoluciones;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()?
        this.selection.clear():
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  todos(): void {
    let v = this;
    if(this.seleccionarTodos){//todo el expediente
      this.dataSource.data.forEach( 
        function logArrayElements(element, index, array) {
            v.selection.select(element)          
      })
    }else{
      this.selection.clear()
    }    
    this.seleccionarTodos = !this.seleccionarTodos;
  }

  normalizar(str: string): string{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  getOptionText(dataItem: MunicipioModel): string {
    return dataItem ? dataItem.Descripcion : '';
  }
  getOptionTextJuzgado (dataItem: CentrosModel): string {
    return dataItem ? dataItem.CentroDgti.Juzgado : '';
  }
  
}
