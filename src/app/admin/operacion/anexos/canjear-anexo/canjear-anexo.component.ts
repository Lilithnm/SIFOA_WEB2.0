import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-canjear-anexo',
  templateUrl: './canjear-anexo.component.html',
  styleUrls: ['./canjear-anexo.component.scss']
})
export class CanjearAnexo implements OnInit, AfterViewInit,OnChanges {
  
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
                  Identificador: [null, []],
                  Expediente: this.fb.group({
                    Identificador: [null, []]
                  }),
                  Estatus: [null, []],
                  Estado: [null, []],
                  Municipio: [null, [Validators.required]], 
                  Depositante: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }),
                  Folio: ["", [Validators.required]],
                  Monto: [null, [Validators.required]],  
                  Oficina: [null, []],
                  Banco: this.fb.group({
                    Identificador: [1, [Validators.required]]
                  }),
                  Concepto: this.fb.group({
                    Identificador: [null, [Validators.required]]
                  }),
                  FechaEmision: [new Date(), [Validators.required]],
                  FechaRegistro: [new Date(), [Validators.required]],
                  FechaContable: [new Date(), [Validators.required]],
                  FechaCaptura: ['', []],
                  FechaDeposito: [new Date(), [Validators.required]],
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

    this.nuevoAnexoForm.FechaDeposito = new Date().toISOString()
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

        this.form.controls['Banco'].disable();        
        this.form.controls['Municipio'].disable();
        this.form.controls['Depositante'].disable();
        this.form.controls['Origen'].disable();
        this.form.controls['Monto'].disable();
        this.form.controls['Oficina'].disable();
        this.form.controls['Concepto'].disable();
        this.form.controls['FechaEmision'].disable();
        this.form.controls['FechaRegistro'].disable();
        this.form.controls['Folio'].disable();
        this.form.controls['Telefono'].disable();
        this.form.controls['CP'].disable();       
        this.form.controls['Domicilio'].disable();  
        this.form.controls['Observaciones'].disable();  
        this.form.patchValue({
          'Municipio': this.nuevoAnexoForm.Municipio
        });
     
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
    this.form.valueChanges.subscribe(x => {

            this.buttonAneDisabledEvent.emit(this.form.valid);
    
            this.nuevoAnexoForm = <AnexoModel>this.form.getRawValue();   
            this.nuevoRegistroEvent.emit(this.nuevoAnexoForm);

      }) 
  }

}
