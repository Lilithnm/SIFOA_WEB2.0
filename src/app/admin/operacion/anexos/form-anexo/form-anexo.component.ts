import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import {NumeroLetra} from 'src/tools/numero-letra'
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { AnexoModel } from 'src/models/main';
import { DomicilioModel, GeneralesModel, PersonajeModel } from 'src/models/generales';
import { BancoModel, BaseModel } from 'src/models/catalogos';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-form-anexo',
  templateUrl: './form-anexo.component.html',
  styleUrls: ['./form-anexo.component.scss']
})
export class FormAnexoComponent implements OnInit, AfterViewInit,OnChanges {
  
  @Output() buttonAneDisabledEvent = new EventEmitter<boolean>();

  @Output() nuevoRegistroEvent = new EventEmitter<AnexoModel>();

  @Output() formValido = new EventEmitter<any>(true);
  @Input() VaGuardar = false;
  @Output() Datosform = new EventEmitter<any>(true);

  @ViewChild('ciudad', {static: false}) ciudadInput!: MatInput;

  
  @Input() nuevoAnexoForm : AnexoModel = new AnexoModel();

  personajes: PersonajeModel[] = [];
  domicilios: DomicilioModel[] = [];
  origenes: BaseModel[] = [];
  bancos: BancoModel[] = [];
  ciudades: BaseModel[] = [];
  conceptos: BaseModel[] = [];
  ciudadesSync!: Observable<BaseModel[]>;
  generales!: GeneralesModel;
  esLibre = false;

  public form: FormGroup = Object.create(null);
  constructor(
    private fb: FormBuilder,
    private svcSpinner: NgxSpinnerService,
    private svcCatalogos: CatalogoService,
    private dialog: MatDialog,
    private numeroLetra: NumeroLetra
  ) {
    const origen1 = new BaseModel();
    origen1.Identificador = 1;
    origen1.Nombre = 'Renta';
    const origen2 = new BaseModel();
    origen2.Identificador = 2;
    origen2.Nombre = 'BANSEFI';

    this.origenes.push(origen1, origen2);

    this.inicializarBancos();
    this.inicializarConceptos()
    this.inicializarCiudades();
    if (localStorage.getItem('Generales')) {
      this.generales = JSON.parse(localStorage['Generales']);
      this.personajes = this.generales.Personajes;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
   
  }

  ngAfterViewInit(): void {
  }
  numeroLetras(){
    return this.numeroLetra.NumerosALetras(this.form.controls['Monto'].value)
  }

  ngOnInit(): void {
    


    this.form = this.fb.group({
                  Expediente: this.fb.group({
                    Identificador: [null, []]
                  }),
                  Estatus: [null, []],
                  Municipio: [null, [Validators.required]], 
                  Depositante: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }),
                  Folio: ["", [Validators.required]],
                  Monto: [null, [Validators.required]],  
                  Oficina: [null, []],
                  Banco: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }),
                  Concepto: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }),
                  FechaEmision: [formatDate(new Date(),'yyyy-MM-dd',"en-US"), [Validators.required]],
                  FechaRegistro: [formatDate(new Date(),'yyyy-MM-dd',"en-US"), [Validators.required]],
                  FechaContable: [formatDate(new Date(),'yyyy-MM-dd',"en-US"), [Validators.required]],
                  FechaDeposito: [null, []],
                  Origen: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }),
                  Domicilio: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }), 
                  Observaciones: [null, []],
                  CP: [null, []],
                  Telefono: [null, []],
                });

    this.form.patchValue( this.nuevoAnexoForm)

    this.form.statusChanges.subscribe((Estatus)=>{
      console.log(this.form)
       //this.returnCall(Estatus);
    });
    /////////////////////////

    if (this.nuevoAnexoForm.Depositante.Identificador)
    {
      this.domicilios = this.personajes.find(x => x.Identificador === this.nuevoAnexoForm.Depositante.Identificador)!.Domicilios;

      if (!this.domicilios) {
        this.dialog.open(ModalComponent, {
          width: '500px',
          data: {Title: 'Atención', Text: 'El personaje no tiene domicilios registrados, para continuar registre al menos un domicilio'}
        });
      }
    }
    if(this.nuevoAnexoForm.Estado == 2){
        this.form.controls['Banco'].disable();        
        this.form.controls['Municipio'].disable();
        this.form.controls['Depositante'].disable();
        this.form.controls['Origen'].disable();
        this.form.controls['Monto'].disable();
        this.form.controls['Oficina'].disable();
        this.form.controls['Concepto'].disable();
        this.form.controls['FechaEmision'].disable();
        this.form.controls['FechaRegistro'].disable();
      //  this.form.controlsFechaContable.disable();
        this.form.controls['FechaDeposito'].disable();
        this.form.controls['Telefono'].disable();
        this.form.controls['CP'].disable();       
        this.form.controls['Domicilio'].disable();  
        this.form.patchValue({
          'Municipio': this.nuevoAnexoForm.Municipio
        });
      }
  


    
    this.escuchadoresForm();

  }

  inicializarBancos(): void {
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 9).subscribe(response => {
      if (response) {
        this.bancos = response;
        this.bancos = this.bancos.filter(ban =>ban.Identificador==1);
      }
    });
  }
  inicializarConceptos(): void {
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 18).subscribe(response => {
      if (response) {
        this.conceptos = response;
      }
    });
  }

  inicializarCiudades(): void {    
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 3).subscribe(response => {
      if (response) {
        this.ciudades = response;
        this.ciudadesSync =  this.form.controls['Municipio'].valueChanges.pipe(
          startWith(null),
          map((search: any) => {
            if (search) {
              console.log(search)
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

  filtrarDomicilios(modSelect: MatSelectChange): void {

    // tslint:disable-next-line: no-non-null-assertion
    this.domicilios = this.personajes.find(x => x.Identificador === modSelect.value)!.Domicilios;

    if (!this.domicilios) {
      this.dialog.open(ModalComponent, {
        width: '500px',
        data: {Title: 'Atención', Text: 'El personaje no tiene domicilios registrados, para continuar registre al menos un domicilio.'}
      });
    }
  }

  getOptionText(dataItem: BaseModel): string {
    console.log()
    return dataItem ? dataItem.Descripcion : '';
  }

  normalizar(str: string): string{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  returnCall(data: string): void {
      this.formValido.emit(data);
  }
  returnform(form: AnexoModel):void{
    this.Datosform.emit(form);
  }
  selectDomicilio(modSelect: MatSelectChange): void {
    let dom;

    this.domicilios.map(function(domicilio) {
          if(domicilio.Identificador == modSelect.value)
            dom = domicilio.Municipio
  });
    this.form.patchValue({
      'Municipio': dom
  });
  }

  escuchadoresForm():void{
    //cuando el form sea valido, mostar boton de agregart
  /* this.paisesControl.valueChanges.subscribe(x => {
      this.nuevoEmpleado.datosDomicilio.idPais = this.paisesControl.value?.idPrincipal?this.paisesControl.value?.idPrincipal:0;
      this.nuevoEmpEvent.emit(this.nuevoEmpleado);
    })
    this.estadosControl.valueChanges.subscribe(x => {
      this.nuevoEmpleado.datosDomicilio.idEstado = this.estadosControl.value?.idPrincipal?this.estadosControl.value?.idPrincipal:0;
      this.nuevoEmpEvent.emit(this.nuevoEmpleado);
    })
    this.municipiosControl.valueChanges.subscribe(x => {
      this.nuevoEmpleado.datosDomicilio.idMunicipio = this.municipiosControl.value?.idPrincipal?this.municipiosControl.value?.idPrincipal:0;
      this.nuevoEmpEvent.emit(this.nuevoEmpleado);
    })
    this.coloniasDomControl.valueChanges.subscribe(x => {
      this.nuevoEmpleado.datosDomicilio.idColonia = this.coloniasDomControl.value?.idColonia?this.coloniasDomControl.value?.idColonia:0;
      this.nuevoEmpEvent.emit(this.nuevoEmpleado);
    })
    this.plazasControl.valueChanges.subscribe(x => {
      this.nuevoEmpleado.datosPuesto.idPlazaConsec = this.plazasControl.value?.idPrincipal?this.plazasControl.value?.idPrincipal:0;
      this.nuevoEmpEvent.emit(this.nuevoEmpleado);
    })
*/

    this.form.valueChanges.subscribe(x => {

            this.buttonAneDisabledEvent.emit(this.form.valid);
    
            this.nuevoAnexoForm = <AnexoModel>this.form.getRawValue();   
            /////los mat auto complete vinculan el objeto completo por lo que es necesario re asignar solo con los id's
                 /*   //cuando cambie asignar a los objetos
            this.nuevoEmpleado.datosDomicilio.idPais = this.paisesControl.value?.idPrincipal?this.paisesControl.value?.idPrincipal:0;
            this.nuevoEmpleado.datosDomicilio.idEstado = this.estadosControl.value?.idPrincipal?this.estadosControl.value?.idPrincipal:0;
            this.nuevoEmpleado.datosDomicilio.idMunicipio = this.municipiosControl.value?.idPrincipal?this.municipiosControl.value?.idPrincipal:0;
            this.nuevoEmpleado.datosDomicilio.idColonia = this.coloniasDomControl.value?.idColonia?this.coloniasDomControl.value?.idColonia:0;
            this.nuevoEmpleado.datosPuesto.idPlazaConsec = this.plazasControl.value?.idPrincipal?this.plazasControl.value?.idPrincipal:0;
        
            this.nuevoMovimiento.IdPlaza = this.plazasControl.value?.idPrincipal?this.plazasControl.value?.idPrincipal:0;
            this.nuevoMovimiento.FechaInicio =  this.nuevoEmpleado.datosPuesto.inicio;
            this.nuevoMovimiento.FechaFin = this.nuevoEmpleado.datosPuesto.fin;
            this.nuevoMovimiento.TipoMovimiento = 1;
            this.nuevoEmpleado.listaTelefonos = this.telefonos;
            this.nuevoEmpleado.correosElectronicos = this.correos;
            this.nuevoEmpleado.datosPuesto.inicio = this.convierteFecha(this.nuevoEmpleado.datosPuesto.inicio)
            this.nuevoEmpleado.datosPuesto.fin = this.convierteFecha(this.nuevoEmpleado.datosPuesto.fin)
            this.nuevoEmpleado.datosCandidato.fechaNacimiento = this.convierteFecha(this.nuevoEmpleado.datosCandidato.fechaNacimiento)*/
            
            this.nuevoRegistroEvent.emit(this.nuevoAnexoForm);

      }) 
  }

}
