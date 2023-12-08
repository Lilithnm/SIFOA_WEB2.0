import { Component, OnInit, Input,ViewChild, Inject, Optional  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomicilioModel } from 'src/models/generales';
import { BaseModel } from 'src/models/catalogos';
import { GeneralesService } from 'src/services/sifoa/generales.service';
import { CatalogoService } from 'src/services/shared/catalogo.service';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent  implements OnInit {

  domicilio: DomicilioModel = new DomicilioModel();
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('municipio', {static: false}) municipioInput!: MatInput;
  @ViewChild('estado', {static: false}) estadoInput!: MatInput;

  
  guardar=false;
  municipios: BaseModel[] = [];
  municipiosSync!: Observable<BaseModel[]>;

  estados: BaseModel[] = [];
  estadosSync!: Observable<BaseModel[]>;
  
  domicilioEdita: DomicilioModel = new DomicilioModel();

    public form: FormGroup = Object.create(null);
    constructor( private fb: FormBuilder, private svcSpinner: NgxSpinnerService, 
              @Optional() @Inject(MAT_DIALOG_DATA) public  data: DomicilioModel,
              private svcGenerales: GeneralesService, 
              private svcCatalogos: CatalogoService,
              private dialogRef: MatDialogRef<DomicilioComponent>) {
      this.form = this.fb.group({
        NumeroInterno: [null],
        NumeroExterno: [null, [Validators.required]],
        Colonia: [null, [Validators.required]],
        Calle: [null, [Validators.required]],
        Comun: [false],
        Procesal: [false],
        Estado: [null, [Validators.required]],
        Municipio: [null, [Validators.required]]
      });
      this.domicilioEdita = data;
      console.log(data)
      this.inicializarEstados()
      this.inicializarMunicipios();

      if(this.domicilioEdita!=null){
        this.form.patchValue(this.domicilioEdita);
      }
    }

  ngOnInit(): void {
 
  }


  agregar(){
    if(this.form.valid)
    {
      this.guardar=true;
      this.domicilio = this.form.getRawValue();
      this.domicilio.Identificador = this.domicilioEdita?.Identificador;
      this.domicilio.IdPersonaje = this.domicilioEdita?.IdPersonaje;
      
      this.dialogRef.close();
    } 
    else {
      this.form.markAllAsTouched();
    }
  }


  inicializarMunicipios(): void {
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 3).subscribe(response => {
      if (response) {
        this.municipios = response;
        this.municipiosSync =  this.form.controls['Municipio'].valueChanges.pipe(
          startWith(null),
          map((search: any) => {
            if (search) {
              if (search.Descripcion) {
                return this.municipios.filter(e => this.normalizar(e.Descripcion).includes(search.Descripcion.toLocaleLowerCase())).slice(0, 10);
              } else {
                return this.municipios.filter(e => this.normalizar(e.Descripcion).includes(search.toLocaleLowerCase())).slice(0, 10);
              }
            } else {
              return this.municipios.slice(0, 1000);
            }
          })
        );
        this.municipioInput.value = '';        
      }
    });
  
  }
  inicializarEstados(): void {    
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 2).subscribe(response => {
      if (response) {
        this.estados = response;
        this.estadosSync =  this.form.controls['Estado'].valueChanges.pipe(
          startWith(null),
          map((search2: any) => {
            if (search2) {

            if (search2.Nombre) {
                return this.estados.filter(e => this.normalizar(e.Nombre).includes(search2.Nombre.toLocaleLowerCase())).slice(0, 10);
              } else {
                return this.estados.filter(e => this.normalizar(e.Nombre).includes(search2.toLocaleLowerCase())).slice(0, 10);
              }
            } else {
              return this.estados.slice(0, 1000);
            }
          })
        );
        this.estadoInput.value = '';
      }
    });
  
  }


  normalizar(str: string): string{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  getOptionText(dataItem: BaseModel): string {
    return dataItem ? dataItem.Descripcion : '';
  }

  getOptionTextEstado(dataItem: BaseModel): string {
    return dataItem ? dataItem.Nombre : '';
  }

  cancelar(){
    this.guardar=false;
    this.dialogRef.close();
  }

}

