import { Component,EventEmitter,Inject, Optional, Output  } from '@angular/core';
import { PersonajeModel,GeneralesModel,DomicilioModel } from '../../../models/generales';
import { BaseModel, BancoModel } from '../../../models/catalogos';
import { DepositoModel, GarantiaModel } from '../../../models/main';
import { CatalogoService } from '../../../services/shared/catalogo.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal, { SweetAlertResult } from 'sweetalert2';
import { DepositoService } from 'src/app/services/sifoa/deposito.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';
import { EventService } from 'src/app/services/shared/event.service';

@Component({
  selector: 'app-formulario-deposito',
  templateUrl: './formulario-deposito.component.html',
  styleUrls: ['./formulario-deposito.component.scss']
})
export class FormularioDepositoComponent {

  bancos: BancoModel[] = [];
  public montoGarantia: number = 0;
  public sumaMontos:number=0;
  destroy$: Subject<boolean> = new Subject<boolean>();
  nuevoDeposito: DepositoModel = new DepositoModel();
  @Output() guardaRefresca = new EventEmitter<any>(true);

  montoRestante: number =0;
  public form: FormGroup = Object.create(null);
  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {gara:GarantiaModel, montos:number},
    private svcCatalogos: CatalogoService,
    private svcDepositos: DepositoService,
   private svcSpinner: NgxSpinnerService,
    private dialog: MatDialog,
    private evtSvc: EventService) {
      this.nuevoDeposito.IdGarantia = data.gara.Identificador;
      this.nuevoDeposito.Estatus =1;
      this.nuevoDeposito.Estatus =1;
      this.nuevoDeposito.Banco=new BaseModel();
      this.nuevoDeposito.Expediente.Identificador = data.gara.Expediente.Identificador;
      this.montoGarantia = data.gara.Importe;
      this.sumaMontos = data.montos;

      this.montoRestante = this.montoGarantia - this.sumaMontos;
      this.inicializarBancos()
      this.construirFormulario()
  }
  
  inicializarBancos(): void {
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 9).subscribe(response => {
      if (response) {
        this.bancos = response;
      }
    });
  }

  construirFormulario() {
    this.form = this.fb.group({
      FechaDeposito: [null, [Validators.required]],
      FechaRecepcion: [null, [Validators.required]],
      NumeroDocumento: [null, [Validators.required]],
      Monto: [this.montoRestante,  [Validators.required]],
      IdentificadorBanco: [null, [Validators.required]],
    }, { validators: this.validaMontos });
  }

  validaMontos: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let monto = group.get('Monto')?.value? group.get('Monto')?.value : '';
    let validado =( monto <=(this.montoGarantia-this.sumaMontos));
    return validado ? null : { montoValido: true }
  }

  getOptionText(dataItem: BaseModel): string {
    return dataItem ? dataItem.Descripcion : '';
  }

  normalizar(str: string): string{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  guardar(){
    if (this.form.invalid){
      Object.values( this.form.controls ).forEach( control => {
        control.markAllAsTouched();
      });
    } else {

      this.nuevoDeposito.FechaDeposito = this.form.get('FechaDeposito')?.value;
      this.nuevoDeposito.FechaRecepcion = this.form.get('FechaRecepcion')?.value;
      this.nuevoDeposito.NumeroDocumento = this.form.get('NumeroDocumento')?.value;
      this.nuevoDeposito.Monto = this.form.get('Monto')?.value;
      this.nuevoDeposito.Banco.Identificador = this.form.get('IdentificadorBanco')?.value;
    
      this.svcSpinner.show();
      this.svcDepositos.CrearDeposito(this.nuevoDeposito).pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.evtSvc.emitChildEvent('guardade')

        swal.fire({
          title: 'Éxito',
          text: 'Se guardo el depósito correctamente.',
          icon: 'success'
        });
        
        this.dialog.closeAll()
      }, errResponse => {
        this.svcSpinner.hide();      
      }, () => {
        this.svcSpinner.hide();      
      });
      

    }

    }
  
 
}

