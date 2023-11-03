import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith, tap } from 'rxjs';
import { BaseModel } from 'src/models/catalogos';
import { CentrosModel } from 'src/models/generales';
import { MaterialModel, SolicitudMaterialesModel, SolicitudModel } from 'src/models/main';
import { SolicitudService } from 'src/services/materiales/solicitud.service';
import { CatalogoService } from 'src/services/shared/catalogo.service';

import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { selectRowInterface } from '../solicitud/solicitudes-tabla.component';
@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.component.html',
  styleUrls: ['./nueva-solicitud.component.scss'],
})
export class NuevaSolicitudComponent {

  
  @ViewChild('ConfirmaPedidoSw') private ConfirmaSw!: SwalComponent;
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  
  grupos:BaseModel [] = [];
  grupoDefault: BaseModel|undefined = new BaseModel(6) ;
  materiales : MaterialModel []=[];

  nuevaSolicitud: SolicitudModel = new SolicitudModel(0);
  //autocomplete  
  gruposFiltrados: Observable<BaseModel[]> | undefined;
  materialesFiltrados: Observable<MaterialModel[]> | undefined;
  grupoControl = new FormControl<string |BaseModel>('');
  observacionesControl = new FormControl<string >('');
  
  materialesControl = new FormControl<MaterialModel>(new MaterialModel(0));

  cantidad:number=1;
  unidad:string="";

  centro:CentrosModel = new CentrosModel(0);
  data : SolicitudMaterialesModel []=[];
  
    selectedRowData?: selectRowInterface;
    newUserImg = 'assets/images/user/user1.jpg';
    filteredData: SolicitudMaterialesModel[] = [];
    register?: UntypedFormGroup;
    selectedOption?: string;
    SortType = SortType;
    periodo: string=""
  
  breadscrums = [
    {      
      title: 'Solicitudes',
      items: [],
      active: 'Nueva Solicitud',
    },
  ];
  constructor(private fb: UntypedFormBuilder, private svcSpinner: NgxSpinnerService,  
    private svcCatalogos: CatalogoService,  
    private router: Router,
    private svcSolicitud: SolicitudService) {
    let centrostr= localStorage.getItem('Centro');
    
    this.centro.Identificador = parseInt( centrostr!=null?centrostr:'');
    
    this.nuevaSolicitud.CentroSolicita = this.centro;

    this.cargaCatalogos();
    
    let periodo= localStorage.getItem('Periodo');

  }
  ngOnInit(): void {   


    this.gruposFiltrados = this.grupoControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const grupoDesc = typeof value === 'string' ? value : value?.['Descripcion']

        return grupoDesc ? this._filterGrupo(value as string) : this.grupos.slice();
      }),      
      tap(() => this.grupoControl.setValue(this.grupoDefault?this.grupoDefault:null)))
    
    this.materialesFiltrados = this.materialesControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const materialesDesc = typeof value === 'string' ? value : value?.['Descripcion']

        return materialesDesc ? this._filterMaterial(value as string) : this.materiales.slice();
      }),
    );
    
  }
  
  eliminarMaterial(row: SolicitudMaterialesModel){
    Swal.fire({
        title: '¿ELIMINAR '+row.Material.TextoMaterial+' DE LA LISTA?',
        showCancelButton: true,
        icon:'question',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
       if (result.isConfirmed) {
        
          this.data = this.data.filter(obj =>{ return obj !== row});
          this.filteredData = this.filteredData.filter(obj =>{ return obj !== row});
          
          Swal.fire('Eliminado', '', 'success')
        }
    })
  }
  generaSolicitud(){    
    if(this.data.length==0){
      Swal.fire('Atención', 'No puede guardar sin capturar materiales', 'info')
    }
    else{
      this.ConfirmaSw.fire();
    }
  }

  guardaSolicitud(){
    
    this.nuevaSolicitud.Materiales = this.data;
    this.nuevaSolicitud.Observaciones = this.observacionesControl.value;
      this.svcSpinner.show();
     

        this.svcSolicitud.CrearSolicitud(this.nuevaSolicitud).subscribe(respuesta => {
          this.svcSpinner.hide();
                
          Swal.fire({
            icon: 'success',
            title: 'Solicitud Guardada',            
          }).then((result) => {            
              this.router.navigate(['/solicitante/solicitudes']);      
          })        
          
        }, () => { }, () => {
        });


  }

  obtieneMateriales(value: BaseModel){
    
    this.materialesControl.setValue(new MaterialModel(0));    
    this.svcCatalogos.ObtenerCatalogo(new BaseModel(value.Identificador),1 ).subscribe(respuesta => {
      this.materiales = respuesta
      this.materialesFiltrados = this.materialesControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const materialesDesc = typeof value === 'string' ? value : value?.['Descripcion']
  
          return materialesDesc ? this._filterMaterial(value as string) : this.materiales.slice();
        }),
      );
    }, () => { }, () => {
    });

  }
  seleccionaMat(mat: MaterialModel){
  this.unidad =mat.Unidad;
  }
  

  displayGrupoFn(grupo: BaseModel): string {
    return grupo && grupo.Descripcion ? grupo.Descripcion : '';
  }


  clear(){
    
    this.grupoControl.setValue(this.grupoDefault?this.grupoDefault: new BaseModel(-1));      
  }

  private _filterGrupo(Descripcion: string): BaseModel[] {
    const filterValue = Descripcion.toString().toLowerCase();
    return this.grupos.filter(option => option.Descripcion.toString().toLowerCase().includes(filterValue));
  }

  setMaterial(){
  }


  displayMaterialesFn(material: MaterialModel): string {
    return material && material.TextoMaterial ? material.TextoMaterial : '';
  }

  private _filterMaterial(TextoMaterial: string): MaterialModel[] {
    const filterValue = TextoMaterial.toString().toLowerCase();
    return this.materiales.filter(option => option.TextoMaterial.toString().toLowerCase().includes(filterValue));
  }


  cargaCatalogos(){
      //grupo
      this.svcCatalogos.ObtenerCatalogo(new BaseModel(0),3 ).subscribe(respuesta => {

       this.grupos = respuesta;
       this.grupoDefault = this.grupos.find(callback_func);

       // callback function returning the boolean value
       function callback_func(object: BaseModel): boolean {
       
          // if the object color is green, return true; otherwise, return false for a particular object element
          if (object.Identificador == 6) {
             return true;
          }
          return false;
       }


       this.gruposFiltrados = this.grupoControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const grupoDesc = typeof value === 'string' ? value : value?.['Descripcion']
  
          return grupoDesc ? this._filterGrupo(value as string) : this.grupos.slice();
        }),
        tap(() => this.grupoControl.setValue(this.grupoDefault?this.grupoDefault:null)))
      }, () => { }, () => {
      });
    //materiales
    this.svcCatalogos.ObtenerCatalogo(this.grupoDefault?this.grupoDefault:new BaseModel(6),1 ).subscribe(respuesta => {
      this.materiales = respuesta
      this.materialesFiltrados = this.materialesControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const materialesDesc = typeof value === 'string' ? value : value?.['Descripcion']
  
          return materialesDesc ? this._filterMaterial(value as string) : this.materiales.slice();
        }),
      );
    }, () => { }, () => {
    });


  }
  agregaMaterial(){
    let nuevoMaterial = new SolicitudMaterialesModel(0);
    nuevoMaterial.Material = this.materialesControl.value? this.materialesControl.value : new MaterialModel(0);
    nuevoMaterial.CantidadSolicitada = this.cantidad;
    if(nuevoMaterial.Material.Identificador>0){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Agregado',
        showConfirmButton: false,
        timer: 1500,
        width:'15em'
      })
  
      this.data.push(nuevoMaterial)
      this.data = [...this.data];
  
      this.filteredData.push(nuevoMaterial)
      this.filteredData = [...this.filteredData];
  
      this.grupoControl.setValue(this.grupoDefault?this.grupoDefault: new BaseModel(0));        
      this.materialesControl.setValue(new MaterialModel(0));   
      this.cantidad =1; 
  
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Atención',
        text: 'Debe seleccionar un material',
        showConfirmButton: false,
        timer: 1500,
        width:'15em'
      })
    }


  
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




}
