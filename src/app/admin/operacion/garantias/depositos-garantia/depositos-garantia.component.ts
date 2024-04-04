import { Component, OnInit,ViewChild, Input, Output, EventEmitter, AfterViewInit, OnChanges, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { DepositoService } from 'src/services/sifoa/deposito.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal, { SweetAlertResult } from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { InformacionTablaModel } from 'src/models/modelos';
import { DepositoModel, DevolucionModel, GarantiaModel } from 'src/models/main';
import { DevolucionService } from 'src/services/sifoa/devolucion.service';
import { Functions } from 'src/tools/functions';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BaseModel } from 'src/models/catalogos';

@Component({
  selector: 'app-depositos-garantia',
  templateUrl: './depositos-garantia.component.html',
  styleUrls: ['./depositos-garantia.component.scss']
})
export class DepositosGarantiaComponent implements OnInit {
  
  
  @ViewChild('deposito') private depositoSw!: SwalComponent;


  @Input() modGarantia: GarantiaModel = new GarantiaModel();

  destroy$: Subject<boolean> = new Subject<boolean>();
  depositoObt: DepositoModel = new DepositoModel();
  depositoCapt: DepositoModel= new DepositoModel();
  
  devolucionObt: DevolucionModel = new DevolucionModel();
  
  @Output() notifyGrandParent= new EventEmitter();

  devolucionesLst: DevolucionModel[] = [];
  sumaMontos: number = 0;

  displayedColumns = [
    'monto',
    'fechaDeposito',
    'fechaRecepcion',
    'anular'

  ];
  dataSource: MatTableDataSource<DepositoModel> = new MatTableDataSource<DepositoModel>;

  public form: FormGroup = Object.create(null);
  @Output() guardaRefresca = new EventEmitter<any>(true);

  montoRestante: number =0;

  constructor( private svcDevoluciones: DevolucionService,    private fb: FormBuilder,
              private svcDepositos: DepositoService,private svcDevolucion: DevolucionService, private svcSpinner: NgxSpinnerService, public dialog: MatDialog,
              private toolFunctions: Functions,
              private datePipe: DatePipe) {


              }
    
  ngOnInit(): void { 
    //objeto para obte ner todos los correspondientes a la garantia
    this.montoRestante= this.modGarantia.Importe
    this.depositoObt.IdGarantia=this.modGarantia.Identificador;
    this.devolucionObt.IdGarantia=this.modGarantia.Identificador;
    this.obtenerDepositos()
    this.obtenerDevoluciones()

    this.form = this.fb.group({
      FechaDeposito: [new Date(), [Validators.required]],
      Monto: [this.montoRestante,  [Validators.required]],
    }, { validators: this.validaMontos });


  }
  
  childEvent(event: any) {
    this.notifyGrandParent.emit('event')
  }


  obtenerDepositos(){
    this.svcSpinner.show();
    this.svcDepositos.ObtenerDepositos(this.depositoObt).pipe(takeUntil(this.destroy$)).subscribe(response => {
      if(response){
        this.dataSource.data = response
        let v = this;
        response.map(function(deposito) {
          v.sumaMontos += deposito.Monto;
       });

       this.montoRestante = this.modGarantia.Importe - this.sumaMontos;

       this.form.patchValue({'Monto':this.montoRestante})
      }
    }, errResponse => {
      this.svcSpinner.hide();      
    }, () => {
      this.svcSpinner.hide();      
    });
    
}


  anularDeposito(deposito:DepositoModel){
    if(this.devolucionesLst.length>0){//ya hay devoluciones, no se puede anular
      swal.fire({
        title: 'Anular',
        text: 'El depósito no puede ser anulado, ya existen devoluciones.',
        icon: 'info'
      });
    }else{  

      if(this.modGarantia.Anexo.Identificador>0){//si viene de un anexo, no se puede anular
        swal.fire({
          title: 'Anular',
          text: 'El depósito no puede ser anulado ya que viene de un anexo.',
          icon: 'info'
        });
      }else{
        swal.fire({
          title: 'Anular',
          text: "¿Desea anular el depósito?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Anular',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.svcSpinner.show();
            this.svcDepositos.Anular(deposito).pipe(takeUntil(this.destroy$)).subscribe(response => {
              swal.fire({
                title: 'Éxito',
                text: 'Deposito anulado',
                icon: 'success'
              }).then(()=>{location.reload()});
            }, errResponse => {
              this.svcSpinner.hide();      
            }, () => {
              this.svcSpinner.hide();      
            });
          }
        });
      }
    }
  }


  obtenerDevoluciones(){
    this.svcSpinner.show();
    this.svcDevoluciones.ObtenerDevoluciones(this.devolucionObt).pipe(takeUntil(this.destroy$)).subscribe(response => {
      if(response){
        this.devolucionesLst = response
      }
    }, errResponse => {
      this.svcSpinner.hide();      
    }, () => {
      this.svcSpinner.hide();      
    });
}
formatFecha(fecha:string){
  // console.log(fecha)
   return this.datePipe.transform(fecha, 'dd/MM/yyyy');
 }

 construirFormulario() {
  this.form = this.fb.group({
    FechaDeposito: [null, [Validators.required]],
    Monto: [this.montoRestante,  [Validators.required]],
  }, { validators: this.validaMontos });
}

validaMontos: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
  let monto = group.get('Monto')?.value? group.get('Monto')?.value : '';
  let validado =( monto <=(this.modGarantia.Importe-this.sumaMontos));
  return validado ? null : { montoValido: true }
}

guardar(){
  if (this.form.invalid){
    Object.values( this.form.controls ).forEach( control => {
      control.markAllAsTouched();
    });
  } else {

      let  nuevoDeposito: DepositoModel = new DepositoModel();
      nuevoDeposito.Expediente.Identificador = this.modGarantia.Expediente.Identificador
      nuevoDeposito.Banco = new BaseModel()
      nuevoDeposito.Banco.Identificador = this.modGarantia.Banco.Identificador
      nuevoDeposito.Estado =  1
      nuevoDeposito.Estatus = 1
      nuevoDeposito.IdGarantia = this.modGarantia.Identificador;
      nuevoDeposito.FechaDeposito = this.form.get('FechaDeposito')?.value;
      nuevoDeposito.FechaRecepcion = nuevoDeposito.FechaDeposito
      nuevoDeposito.Monto = this.form.get('Monto')?.value;
      console.log(nuevoDeposito)
  
      this.svcSpinner.show();
      this.svcDepositos.CrearDeposito(nuevoDeposito).subscribe(response => {

        swal.fire({
          title: 'Éxito',
          text: 'Se guardo el depósito correctamente.',
          icon: 'success'
        }).then(()=>{location.reload()});;

    });
    
  }

  }


}
