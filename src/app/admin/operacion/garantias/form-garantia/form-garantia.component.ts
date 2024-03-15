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
import { GarantiaModel } from 'src/models/main';
import { DomicilioModel, GeneralesModel, PersonajeModel } from 'src/models/generales';
import { BancoModel, BaseModel } from 'src/models/catalogos';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-form-garantia',
  templateUrl: './form-garantia.component.html',
  styleUrls: ['./form-garantia.component.scss']
})
export class FormGarantiaComponent implements OnInit, AfterViewInit,OnChanges {
  
  @Output() buttonAneDisabledEvent = new EventEmitter<boolean>();

  @Output() nuevoRegistroEvent = new EventEmitter<GarantiaModel>();

  @Output() formValido = new EventEmitter<any>(true);
  @Output() Datosform = new EventEmitter<any>(true);


  
  @Input() nuevaGaraForm : GarantiaModel = new GarantiaModel();

  @Input() isMode = 1;
  @Output() formularioValido = new EventEmitter<any>(true);
  @Input() VaGuardar = false;
  @Output() DatosFormulario = new EventEmitter<any>(true);

  @ViewChild('ciudad', {static: false}) ciudadInput!: MatInput;

  personajes: PersonajeModel[] = [];
  domicilios: DomicilioModel[] = [];
  origenes: BaseModel[] = [];
  conceptos: BaseModel[] = [];
  ciudades: BaseModel[] = [];
  ciudadesSync!: Observable<BaseModel[]>;
  bancos: BancoModel[] = [];
  generales!: GeneralesModel;
  esLibre = false;
  diasVigencia :number = 2592000000; // formula dias(30) *24*60*60*1000
  convertir: any;
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
    return this.numeroLetra.NumerosALetras(this.form.controls['Importe'].value)
  }


  ngOnInit(): void {
    
    this.form = this.fb.group({
      Expediente: this.fb.group({
        Identificador: [null, []]
      }),
      Personaje: this.fb.group({
        Identificador: [null, [Validators.required]]
      }),
      Estatus: [null, []],      
      Municipio: [null, [Validators.required]],
      Banco: this.fb.group({
        Identificador: [1, [Validators.required]]
      }),
      Domicilio: this.fb.group({
        Identificador: [null, [Validators.required]]
      }), 
      Concepto: this.fb.group({
        Identificador: [null, [Validators.required]]
      }),    
      Fecha : [formatDate(new Date(),'yyyy-MM-dd',"en-US"), [Validators.required]],
      FechaVigencia: [formatDate(new Date().getTime() + this.diasVigencia,'yyyy-MM-dd',"en-US"), [Validators.required]],
      Folio: [""],
     // FolioAnterior: [null, []],
      Convenio: [null, [Validators.required]],        
      Importe: [0, [Validators.required, Validators.min(.01)]],
      Observaciones: [null, []],
      CP: [null, []],
      Telefono: [null, []]
    });
    
      
    this.form.patchValue( this.nuevaGaraForm)

    
    this.form.controls['Fecha'].disable();
    this.form.controls['FechaVigencia'].disable();
    this.form.controls['Convenio'].disable();
    this.form.statusChanges.subscribe((Estatus)=>{
      this.returnCall(Estatus);
    });


    if (this.nuevaGaraForm.Personaje.Identificador)
    {
      this.domicilios = this.personajes.find(x => x.Identificador === this.nuevaGaraForm.Personaje.Identificador)!.Domicilios;

      if (!this.domicilios) {
        this.dialog.open(ModalComponent, {
          width: '500px',
          data: {Title: 'Atención', Text: 'El personaje no tiene domicilios registrados, para continuar registre al menos un domicilio'}
        });
      }
    }
    
    this.escuchadoresForm();

  }

  inicializarBancos(): void {
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 9).subscribe(response => {
      if (response) {
        this.bancos = response;
        this.bancos = this.bancos.filter(ban =>ban.Identificador!=2);
              
        ///filtrar bancos
        
         this.cambiaConvenioProg()
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
    return dataItem ? dataItem.Descripcion : '';
  }

  normalizar(str: string): string{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  returnCall(data: string): void {
      this.formValido.emit(data);
  }
  returnform(form: GarantiaModel):void{
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
    
            this.nuevaGaraForm = <GarantiaModel>this.form.getRawValue();   
            this.nuevoRegistroEvent.emit(this.nuevaGaraForm);

      }) 
  }
  cambiaConvenio(modSelect: MatSelectChange): void 
  {
    let convenio;

    this.bancos.map(function(banco) {
          if(banco.Identificador == modSelect.value)
            convenio = banco.Convenio
   });

    this.form.patchValue({
      'Convenio': convenio
   });
  }  

  cambiaConvenioProg(): void 
  {
    let convenio;
    
        this.bancos.map(function(banco) {
              if(banco.Identificador == 1)
                convenio = banco.Convenio
      });

        this.form.patchValue({
          'Convenio': convenio
      });
  }

}
