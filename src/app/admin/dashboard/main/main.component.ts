import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { BaseModel, CentrosModel, MunicipioModel, SistemasModel, TipoExpedienteModel } from 'src/models/catalogos';
import { ExpedienteBaseModel } from 'src/models/generales';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { CentrosService } from 'src/services/sifoa/centros.service';
import { GeneralesService } from 'src/services/sifoa/generales.service';
import { MunicipiosService } from 'src/services/sifoa/municipios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  
  destroy$: Subject<boolean> = new Subject<boolean>();

  public form: FormGroup = Object.create(null);

  arrMunicipios: MunicipioModel[]=[];
  
  listCentros: CentrosModel[] = [];

  
  centrosSync!: Observable<CentrosModel[]>;

//****autocomplete */
municipios: MunicipioModel[]=[];
municipiosFiltrados: Observable<MunicipioModel[]> | undefined;

juzgadosTodos: CentrosModel[]=[];
juzgados: CentrosModel[]=[];
juzgadoosFiltrados: Observable<CentrosModel[]> | undefined;

sistemasTodos: SistemasModel[]=[];
sistema: SistemasModel[]=[];
sistemasFiltrados: Observable<SistemasModel[]> | undefined;

tipoExpediente: BaseModel[]=[];
tipoExpedienteTodos: BaseModel[]=[];
tipoExpedienteFiltrados: Observable<BaseModel[]> | undefined;
////**/ */

expedienteBusqueda: ExpedienteBaseModel = new ExpedienteBaseModel();

  constructor( private svcCentros: CentrosService,
                private fb: FormBuilder, 
                private svcCatalogos: CatalogoService,
                private svcGenerales: GeneralesService,
                private svcSpinner: NgxSpinnerService,                
              private svcMunicipios: MunicipiosService,) {



    this.form = this.fb.group({
      Identificador:[0,[]],
      Sistema:[this.fb.group({
        Identificador:[0,[]],}),[Validators.required]]     ,
      Anio:[null,[]],
      Numero:[null,[]],
      Centro: [new CentrosModel(),[Validators.required]]     ,
      Municipio:[new MunicipioModel(),[Validators.required]]     ,
      TipoExpediente: [new TipoExpedienteModel(), [Validators.required]]     ,
      omitirTipoExp: [null, []],
      Nomenclatura: [null,  [Validators.required]]     ,
    });


  }

  ngOnInit() {
    this.inicializarMunicipios()
    this.obtieneJuzgados()
    this.obtieneSistemas()
    this.obtieneTiposExpediente()
  }
  inicializarMunicipios(): void {    
   this.svcMunicipios.obtenerMuncipios().subscribe({
     next: (respuesta) => {
       if (respuesta) {
         this.municipios =  respuesta.filter(resultado => resultado.EstadoId == 742);
         this.municipios =  this.municipios.filter(resultado => resultado.Identificador!=0);
         this.municipiosFiltrados = this.form.get('Municipio')?.valueChanges.pipe(
           startWith(''),
           map(value => {
             const municipioDesc = typeof value === 'string' ? value : value?.['Descripcion']
     
             return municipioDesc ? this._filterMunicipio(value as string) : this.municipios.slice();
           }),
         );
       } else {
         //this.error = 'Invalid Login';
       }
     },
     error: (error) => {
     },
   });

  
  }
  displayMuniciopioFn(model: MunicipioModel): string {
    return model && model.Descripcion ? model.Descripcion : '';
  }

  private _filterMunicipio(texto: string): MunicipioModel[] {
    const filterValue = texto.toString().toLowerCase();
    return this.municipios.filter(option => option.Descripcion.toString().toLowerCase().includes(filterValue));
  }

  obtieneJuzgados(){
        
    this.svcCentros.obtenerCentrosH().subscribe({
      next: (respuesta) => {
        if (respuesta) {
          this.juzgadosTodos = respuesta;
        } else {
          //this.error = 'Invalid Login';
        }
      },
      error: (error) => {
      },
    });
  }

  filtraJuzgados(value: MunicipioModel){
    
        this.juzgados = this.juzgadosTodos.filter(resultado => resultado.CentroDgti.IdentificadorMunicipio == value.Identificador);
        this.juzgadoosFiltrados = this.form.get('Centro')?.valueChanges.pipe(
          startWith(''),
          map(value => {
            const juzgadoDesc = typeof value === 'string' ? value : value?.['Descripcion']
    
            return juzgadoDesc ? this._filterJuzgado(value as string) : this.juzgados.slice();
          }),
        );
      
  }


  displayJuzgadoFn(model: CentrosModel): string {
    return model && model.CentroDgti ? model.CentroDgti.Juzgado : '';
  }

  private _filterJuzgado(texto: string): CentrosModel[] {
    const filterValue = texto.toString().toLowerCase();
    return this.juzgados.filter(option => option.CentroDgti.Juzgado.toString().toLowerCase().includes(filterValue));
  }

  obtieneSistemas(){
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 11).subscribe(response => {
      if (response) {        
        this.sistemasTodos = response;
      }
    });
  
}
filtraSistemas(centro: CentrosModel){     

  this.sistema = this.sistemasTodos.filter(resultado => resultado.IdCentroTrabajo == centro.Identificador);
      this.sistemasFiltrados = this.form.get('Sistema')?.valueChanges.pipe(
        startWith(''),
        map(value => {
          const descripcion = typeof value === 'string' ? value : value?.['Descripcion']
  
          return descripcion ? this._filterSistemas(value as string) : this.sistema.slice();
        }),
      );
   
}

displaySistemaFn(model: SistemasModel): string {
  return model && model.Nombre ? model.Nombre : '';
}

private _filterSistemas(texto: string): SistemasModel[] {
  const filterValue = texto.toString().toLowerCase();
  return this.sistema.filter(option => option.Descripcion.toString().toLowerCase().includes(filterValue));
}

obtieneTiposExpediente(){
  const body = '{"Identificador": 0}';
  this.svcCatalogos.ObtenerCatalogo(body, 5).subscribe(response => {
    if (response) {        
      this.tipoExpedienteTodos = response;
    }
  });

}
filtraTiposExp(sistema: BaseModel){     

  this.tipoExpediente = this.tipoExpedienteTodos.filter(resultado => parseInt(resultado.Nombre) == sistema.Identificador);
      this.tipoExpedienteFiltrados = this.form.get('TipoExpediente')?.valueChanges.pipe(
        startWith(''),
        map(value => {
          const descripcion = typeof value === 'string' ? value : value?.['Descripcion']
  
          return descripcion ? this._filterTiposEx(value as string) : this.tipoExpediente.slice();
        }),
      );
   
}
displayTipoExpFn(model: BaseModel): string {
  return model && model.Descripcion ? model.Descripcion : '';
}

private _filterTiposEx(texto: string): BaseModel[] {
  const filterValue = texto.toString().toLowerCase();
  return this.tipoExpediente.filter(option => option.Descripcion.toString().toLowerCase().includes(filterValue));
}
omitirFn(){

  if(this.form.get('omitirTipoExp')?.value){
    this.form.controls['TipoExpediente'].disable()
  }
}


  ValidarBusquedaExpediente(){

      this.expedienteBusqueda = <ExpedienteBaseModel>this.form.getRawValue();   
      console.log(this.expedienteBusqueda)
      //Variables para validación
      let v_PasoValidacion = true;
      let sistemasPenal=[10,11,14,18];

      //Validar el expediente
      if (sistemasPenal.includes(this.expedienteBusqueda.Sistema.Identificador))
      {
        console.log("entra")
          if (this.expedienteBusqueda.Nomenclatura.includes("-"))
          {
              //Validar por el número del expediente
              if (!( this.expedienteBusqueda.Numero=parseInt(this.expedienteBusqueda.Nomenclatura.split("-")[1])))
              {
                  this.MostrarMensaje("El formato del expediente no es correcto, verificar por favor.");
                  v_PasoValidacion = false;
                  
              }
              //Validar por el año del expediente
              if (v_PasoValidacion)
                  if(!( this.expedienteBusqueda.Anio=parseInt(this.expedienteBusqueda.Nomenclatura.split("-")[0].substring(this.expedienteBusqueda.Nomenclatura.split("-")[0].length - 2, 2))))
                  {
                      this.MostrarMensaje("El formato del expediente no es correcto, verificar por favor.");
                      v_PasoValidacion = false;
                  }
          }
          else
          {
              this.MostrarMensaje("El formato del expediente no es correcto, verificar por favor.");
              v_PasoValidacion = false;
          }
      }
      else
      {
          if (this.expedienteBusqueda.Nomenclatura.includes("/"))
          {
              //Validar por el número del expediente
              if (!(this.expedienteBusqueda.Numero= parseInt(this.expedienteBusqueda.Nomenclatura.split("/")[0])))
              {
                  this.MostrarMensaje("El formato del expediente no es correcto, verificar por favor.");
                  v_PasoValidacion = false;
              }

              //Validar por el año del expediente
              if (v_PasoValidacion)
                  if (!(this.expedienteBusqueda.Anio = parseInt(this.expedienteBusqueda.Nomenclatura.split("/")[1])))
                  {
                     this.MostrarMensaje("El formato del expediente no es correcto, verificar por favor.");
                      v_PasoValidacion = false;
                  }
          }
          else
          {
              this.MostrarMensaje("El formato del expediente no es correcto, verificar por favor.");
              v_PasoValidacion = false;
          }

        }

        
      console.log(this.expedienteBusqueda)
      //Variables para validación
      }


        MostrarMensaje(mensaje:string){
          Swal.fire({
            text: mensaje,
            icon: 'info'
          });
        
        }


        ObtenerValidarExpediente(busquedaExpediente: ExpedienteBaseModel): void {

          this.svcGenerales.ObtenerValidar(busquedaExpediente).subscribe({
            next: (res) => {
              if (res) {
                 console.log(res)
              } else {
               Swal.fire({
                  text: 'Verifique, no se encuentra el expediente',
                  icon: 'info'
                });
              }
            },
            error: (error) => {
              Swal.fire({
                text: error,
                icon: 'info'
              });
            },
          });
          
          
          
        }
      

}
