import { Component,Inject, Optional, ViewChild  } from '@angular/core';
import {  AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal, { SweetAlertResult } from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { MatSelectChange } from '@angular/material/select';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Observable } from 'rxjs';
import { MatInput } from '@angular/material/input';
import {formatDate} from '@angular/common';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';
import { BancoModel, BaseModel } from 'src/models/catalogos';
import { BeneficiarioModel, DevolucionModel, GarantiaModel, MultaModel } from 'src/models/main';
import { DomicilioModel, PersonajeModel } from 'src/models/generales';
import { MultaService } from 'src/services/sifoa/multa.service';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { DevolucionService } from 'src/services/sifoa/devolucion.service';
import { BeneficiariosComponent } from '../beneficiarios/beneficiarios.component';
import { NumeroLetra } from 'src/tools/numero-letra';

@Component({
  selector: 'app-formulario-devolucion',
  templateUrl: './formulario-devolucion.component.html',
  styleUrls: ['./formulario-devolucion.component.scss']
})
export class FormularioDevolucionComponent {

  bancos: BancoModel[] = [];
  public montoGarantia: number = 0;
  diasVigencia :number = 2592000000; 
  modMulta: MultaModel = new MultaModel();
  destroy$: Subject<boolean> = new Subject<boolean>();
  nuevaDevolucion: DevolucionModel = new DevolucionModel();
  beneficiariosLst: BeneficiarioModel[]=[];
  beneficiariosLst2: BeneficiarioModel[]=[];
  totalDepositos: number =0;
  garntiaP: GarantiaModel = new GarantiaModel();
  ciudades: BaseModel[] = [];
  conceptos: BaseModel[] = [];
  ciudadesSync!: Observable<BaseModel[]>;
  personajes: PersonajeModel[] = [];
  domicilios: DomicilioModel[] = [];
  public form: FormGroup = Object.create(null);
  public formMulta: FormGroup = Object.create(null);
  sumDepositos:number = 0;
  restante:number = 0;
  sumDevoluciones:number = 0;
  convertir: any;
  
  @ViewChild('ciudad', {static: false}) ciudadInput!: MatInput;
  
  constructor(
    private svcMultas: MultaService,
    private fb: FormBuilder, private svcCatalogos: CatalogoService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {gara:GarantiaModel, devolucion: DevolucionModel ,totalDepositos: number,totalDevoluciones: number},
    private svcDevoluciones: DevolucionService, private svcSpinner: NgxSpinnerService, private dialog: MatDialog,
    private numeroLetra: NumeroLetra) {
      
      this.garntiaP = data.gara;
      this.sumDepositos = data.totalDepositos;
      this.sumDevoluciones = data.totalDevoluciones;
      this.restante = data.totalDepositos - data.totalDevoluciones;
      
      this.inicializarConceptos();
      this.construirFormulario()
      
      this.nuevaDevolucion = data.devolucion;

      if(this.nuevaDevolucion.Identificador >0){
        //modifica endoso        
        this.nuevaDevolucion = data.devolucion;
        this.beneficiariosLst = this.nuevaDevolucion.Beneficiarios;
        this.beneficiariosLst2= this.nuevaDevolucion.Beneficiarios;
        this.form.patchValue(this.nuevaDevolucion);
        
        this.form.controls['Tipo'].disable();      
        this.form.controls['Monto'].disable();      
        this.form.patchValue({
          Tipo: this.nuevaDevolucion.Tipo.toString()
        });
         

      }else{
        //nueva               
        this.nuevaDevolucion.IdGarantia = data.gara.Identificador;
        this.nuevaDevolucion.Expediente.Identificador = data.gara.Expediente.Identificador;
        this.nuevaDevolucion.FechaLiberacion="1753-01-01";
        this.nuevaDevolucion.FechaDevolucion="1753-01-01";
        this.nuevaDevolucion.FechaFinalizacion="1753-01-01";
        this.nuevaDevolucion.FechaEndosamiento =  new Date().toISOString().split('T')[0];
        this.nuevaDevolucion.Estado = 1;
        this.nuevaDevolucion.Monto=this.restante
        this.nuevaDevolucion.Estatus = 1;        
      }
      
      if (localStorage.getItem('Generales')) {
        this.personajes =  JSON.parse(localStorage['Generales']).Personajes;
      }       
      
      const ticketJson = localStorage.getItem('UsrHy');

      
  }
  numeroLetras(){
    return this.numeroLetra.NumerosALetras(this.form.controls['Importe'].value, this.garntiaP.Banco )
  }
  numeroLetrasMulta(){
    return this.numeroLetra.NumerosALetras(this.formMulta.controls['Importe'].value, this.garntiaP.Banco )
  }

  inicializarConceptos(): void {
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 18).subscribe(response => {
      if (response) {
        this.conceptos = response;

        
        this.conceptos =  this.conceptos.filter(concepto => (concepto.Nombre.includes('MULTA')|| concepto.Nombre.includes('CONMUTA')));

        //this.conceptos =  this.conceptos.filter(concepto => concepto.Nombre.includes('PENA'));
      }
    });
  }

  cambiaTipo(){
   // this.inicializarBancos();
    if(this.form.get('Tipo')?.value == 3){
      this.inicializarCiudades();
    }
   
    if(this.form.get('Tipo')?.value == 2){
      this.form.controls['Concepto'].setValidators([Validators.required]);
    }
  }

  construirFormulario() {
    
    this.formMulta = this.fb.group({
      Expediente: this.fb.group({
        Identificador: [null, []]
      }),
      Garantia: this.fb.group({
        Identificador: [null, []]
      }),
      Personaje: this.fb.group({
        Identificador: [null, [Validators.required]]
      }),
      Domicilio: this.fb.group({
        Identificador: [null, [Validators.required]]
      }), 
      Municipio: [null, [Validators.required]],
      CP: [null, []],
      Telefono: [null, []],
      Fecha : [formatDate(new Date(),'yyyy-MM-dd',"en-US"), [Validators.required]],
      FechaVigencia: [formatDate(new Date().getTime() + this.diasVigencia,'yyyy-MM-dd',"en-US"), [Validators.required]],
     /*  Banco: this.fb.group({
        Identificador: [null, [Validators.required]]
      }), */        
      Concepto: this.fb.group({
        Identificador: [null, [Validators.required]]
      }),
      /* Convenio: [null, [Validators.required]], */         
      Importe: [this.restante, [Validators.required]],
      Observaciones: [null, []]
    }, { validators: this.validaMontosMulta });
    //this.formMulta.
    
    this.formMulta.controls['Municipio'].disable();
    //this.formMulta.controls.Convenio.disable();
    this.formMulta.controls['FechaVigencia'].disable();
    this.formMulta.controls['Fecha'].valueChanges.subscribe(
      (selectedValue) => {

        let fecha= new Date(selectedValue); 
        let fechaVigencia = new Date(fecha.getTime()+ this.diasVigencia);   
        let dia =fechaVigencia.getDate()<10?'0'+fechaVigencia.getDate():fechaVigencia.getDate(); 
        let mes=fechaVigencia.getMonth()+1;
        let mesReal =mes<10?'0'+mes:mes; 
       
        this.formMulta.controls['FechaVigencia'].setValue(fechaVigencia.getFullYear() +'-'+ mesReal+'-'+dia )
      }
  );  

    this.form = this.fb.group({
      Tipo: [null, [Validators.required]],
      Monto: [this.restante,  [Validators.required]],
      Concepto: [null],
      Observaciones: [null, ],
    }, { validators: this.validaMontos });
  }
///total depositos y total de devoluciones capturadas
   validaMontos: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let monto = group.get('Monto')?.value? group.get('Monto')?.value : '';
    let validado =( monto <=(this.sumDepositos-this.sumDevoluciones));
    return validado ? null : { montoValido: true }
  } 
  validaMontosMulta: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let monto = group.get('Importe')?.value? group.get('Importe')?.value : '';
    let validado =( monto <=(this.sumDepositos-this.sumDevoluciones));
    return validado ? null : { montoValido: true }
  } 

  
  inicializarCiudades(): void {    
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 3).subscribe(response => {
      if (response) {
        this.ciudades = response;
        this.ciudadesSync =  this.formMulta.controls['Municipio'].valueChanges.pipe(
          startWith(null),
          map((search: any) => {
            if (search) {
              if (search.Descripcion) {
                return this.ciudades.filter(e => this.normalizar(e.Descripcion).includes(search.Descripcion.toLocaleLowerCase())).slice(0, 10);
              } else {
                return this.ciudades.filter(e => this.normalizar(e.Descripcion).includes(search.toLocaleLowerCase())).slice(0, 10);
              }
            } else {
              return this.ciudades.slice(0, 1000);
            }
          })
        );
        this.ciudadInput.value = '';
        
      }
    });
  }
    
  agregar(){  
      const dialogRef = this.dialog.open(BeneficiariosComponent, 
      {width: '60vw',
        maxWidth: '100vw',
        disableClose: true,
        data:this.beneficiariosLst
    });

    dialogRef.afterClosed().subscribe(() => {
      this.beneficiariosLst = dialogRef.componentInstance.beneficiariosLista;
      this.beneficiariosLst2= this.beneficiariosLst.filter(ben => ben.Estatus==1);
      this.nuevaDevolucion.ListaCoincidencias = dialogRef.componentInstance.listaCoincidencias;
      console.log(this.nuevaDevolucion)
      
     });  

    }  
    eliminaBeneficiario(beneficiario: BeneficiarioModel){
      this.dialog
      .open(ModalConfirmComponent, {
        data: {Title: 'Eliminar', Text: '¿Desea eliminar al beneficiario?'}
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminarBeneficiario(beneficiario.Identificador);
   
            this.dialog.open(ModalComponent, {
              width: '500px',
              data: {Title: 'Eliminado', Text: 'El beneficiario fue eliminado'}
            });
        } 
      });
      



    } 
    
  getPersonaje(identificador: number): string{
    let nombre="";
      this.personajes.map(function(personaje) {
        if(personaje.Identificador == identificador){
          nombre = personaje.Nombre
        }
      });
    
      return nombre;
  }

  filtrarDomicilios(modSelect: MatSelectChange): void {

    this.domicilios = this.personajes.find(x => x.Identificador === modSelect.value)!.Domicilios;

    if (!this.domicilios) {
      this.dialog.open(ModalComponent, {
        width: '500px',
        data: {Title: 'Atención', Text: 'El personaje no tiene domicilios registrados, para continuar registre el domicilio desde su sistema de gestion.'}
      });
    }
  }

  selectDomicilio(modSelect: MatSelectChange): void {
      let dom;
      this.domicilios.map(function(domicilio) {
            if(domicilio.Identificador == modSelect.value)
              dom = domicilio.Municipio
    });
      this.formMulta.patchValue({
        'Municipio': dom
    });
  }
/* 
  cambiaConvenio(modSelect: MatSelectChange): void 
  {
    let convenio;
    this.bancos.map(function(banco) {
          if(banco.Identificador == modSelect.value)
            convenio = banco.Convenio
   });
    this.formMulta.patchValue({
      'Convenio': convenio
   });
  }
 */
  normalizar(str: string): string{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  guardaMulta(){
    
    if (this.formMulta.invalid){
      Object.values( this.formMulta.controls ).forEach( control => {
        control.markAllAsTouched();
      });
    } else {
      this.modMulta = <MultaModel>this.formMulta.getRawValue();     
      this.modMulta.Garantia.Identificador =  this.nuevaDevolucion.IdGarantia;
      this.modMulta.Expediente.Identificador = this.nuevaDevolucion.Expediente.Identificador;
      this.modMulta.Identificador=0;
      this.modMulta.Estado =1;
      this.modMulta.Estatus =1;
      this.modMulta.Banco= this.garntiaP.Banco;
      this.modMulta.Convenio = this.garntiaP.Banco.Convenio.toString();
      this.modMulta.BancoFinalizar= this.garntiaP.Banco;
      this.modMulta.FechaCaptura = new Date().toISOString().split('T')[0];
      this.modMulta.FechaDeposito ="01-01-1753";
      this.modMulta.FechaCompensacion ="01-01-1753";
      this.modMulta.FechaEndosamiento ="01-01-1753";
      this.modMulta.FechaLiberacion ="01-01-1753";
      this.modMulta.FechaDevolucion ="01-01-1753";
      this.modMulta.FechaFinalizacion ="01-01-1753";  

      this.svcSpinner.show();
      // this.mod.FechaCaptura = new Date().toISOString().split('T')[0] + 'T' + new Date().toLocaleTimeString();   
       this.svcMultas.CrearMulta(this.modMulta).pipe(takeUntil(this.destroy$)).subscribe(multa => {
        swal.fire({
          title: 'Éxito',
          text: 'Multa '+multa.Folio+' guardada correctamente.',
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

  guardaDevolucion(){

    let hayBeneficiarios= this.beneficiariosLst.filter(ben => ben.Estatus==1);
    
    if (this.nuevaDevolucion.Identificador==0&&(this.form.invalid || ( this.form.get('Tipo')?.value=='1' &&hayBeneficiarios.length<1))){
      Object.values( this.form.controls ).forEach( control => {
        control.markAllAsTouched();
      });
      this.dialog.open(ModalComponent, {
        width: '400px',
        data: {Title: 'Advertencia', Text: 'Llene todos los campos'}
      });

    } else {
      if(this.nuevaDevolucion.Identificador>0&& hayBeneficiarios.length==0){
        this.dialog.open(ModalComponent, {
          width: '400px',
          data: {Title: 'Advertencia', Text: 'Capture el beneficiario'}
        });
        return
      }
      let date = new Date();

      var newDate =  new Date(date.setMonth(date.getMonth()+6))

      this.nuevaDevolucion.Tipo = this.form.get('Tipo')?.value;
      this.nuevaDevolucion.Monto = this.form.get('Monto')?.value;
      this.nuevaDevolucion.Concepto = this.form.get('Concepto')?.value;
      this.nuevaDevolucion.FechaVigencia = formatDate(newDate,'yyyy-MM-dd',"en-US");
      this.nuevaDevolucion.Observaciones= this.form.get('Observaciones')?.value;
      this.nuevaDevolucion.Beneficiarios = this.beneficiariosLst;
    
      this.svcSpinner.show();
      if(this.nuevaDevolucion.Identificador>0){
        this.svcDevoluciones.Actualizar(this.nuevaDevolucion).pipe(takeUntil(this.destroy$)).subscribe(response => {
          swal.fire({
            title: 'Éxito',
            text: 'Devolución actualizada correctamente.',
            icon: 'success'
          });
          
          this.dialog.closeAll()
        }, errResponse => {
          this.svcSpinner.hide();      
        }, () => {
          this.svcSpinner.hide();      
        });
      }else{
        this.svcDevoluciones.CrearDevolucion(this.nuevaDevolucion).pipe(takeUntil(this.destroy$)).subscribe(response => {
          swal.fire({
            title: 'Éxito',
            text: 'Devolución guardada correctamente.',
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

  
    guardar(){
      if(this.form.get('Tipo')?.value == 3){
        this.guardaMulta()
      }else{
        this.guardaDevolucion()
      }
    }

    
  getOptionText(dataItem: BaseModel): string {
    return dataItem ? dataItem.Descripcion : '';
  }

  eliminarBeneficiario( busca:number ) {
    for (var bene in this.beneficiariosLst) {
      if (this.beneficiariosLst[bene].Identificador == busca) {
        this.beneficiariosLst[bene].Estatus = 0;
         break; //Stop this loop, we found it!
      }

    }
    
    this.beneficiariosLst2= this.beneficiariosLst.filter(ben => ben.Estatus==1);
    
 }
}

