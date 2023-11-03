import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MediaService } from 'src/services/shared/media.service';
import { DatePipe } from '@angular/common';
import { MaterialModel } from 'src/models/main';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NotificacionesService } from 'src/services/materiales/notificaciones.service';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { MaterialesService } from 'src/services/materiales/materiales.service';
@Component({
  selector: 'app-materiales-tabla',
  templateUrl: './administra-materiales.component.html',
  styleUrls: ['./administra-materiales.component.scss'],
})
export class AdministraMaterialesComponent implements OnInit {

  
  fileUploadForm: UntypedFormGroup;
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  
  
  @ViewChild('MaterialSw') private MaterialForm!: SwalComponent;

  rows = [];
  selectedRowData?: selectRowInterface;
  newUserImg = 'assets/images/user/user1.jpg';
  data: MaterialModel[] = [];
  filteredData: MaterialModel[] = [];
  register?: UntypedFormGroup;
  selectedOption?: string;
  SortType = SortType;
  materialForm = new MaterialModel(0);
  
  MaterialAdmin: MaterialModel = new MaterialModel(0);
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  breadscrums = [
    {
      title: 'Materiales',
      items: [],
      active: 'Administrar Materiales',
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar, // private modalService: NgbModal
    private router: Router,
    private svcSpinner: NgxSpinnerService,
    private svcMateriales: MaterialesService,
    private svcMedia: MediaService,
    private svcNotificaciones: NotificacionesService,
    private datePipe: DatePipe,
  ) {
    this.fileUploadForm = fb.group({
      uploadFile: [''],
    });
  }
  ngOnInit() {
      this.obtenerMateriales();
  
  }
  cargarArchivo(){

      Swal.fire({
            title: '¿Desea actualizar el catálogo de materiales con el archivo?',
            text:'',
            showCancelButton: true,
            icon:'question',
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
          if (result.isConfirmed) {        
           /*     
          this.svcMateriales.CrearActualizar(row).subscribe(respuesta => {
            this.svcSpinner.hide();
                  
            Swal.fire({
              icon: 'success',
              title: 'Desactivado',            
            }).then((result) => {         
              this.obtenerMateriales()     
            })        
            
          }, () => { }, () => {
          });*/

        }

      })
  }
  deleteRow(row: MaterialModel) {
    Swal.fire({
      title: '¿Desea eliminar la Material No. '+row.Identificador+' ?',
      text:'Ésta acción no podrá deshacerse',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {        
          row.Estatus = 0;
          this.svcMateriales.CrearActualizar(row).subscribe(respuesta => {
          //  this.svcSpinner.hide();          
            this.obtenerMateriales()      
              Swal.fire('Eliminada', '', 'success')
          }, () => { }, () => {
          });
        }
    })
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



  getId(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['bg-red'],
    });
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  
  obtieneEstadoMaterial(elemento: any): string{
    switch(elemento.Estado){
      case 1:
        return "Registrado"
      case 2:
        return "Canjeado"
      default:
        return ""
   }
  }


  agregarMaterial(): void {     
    this.materialForm = new MaterialModel(0);
   this.MaterialForm.fire();
  }



  obtenerMateriales(){
    let nuevaMaterial = new MaterialModel(0);
    this.svcSpinner.show();
      this.svcMateriales.ObtenerMateriales(new MaterialModel(0)).subscribe(respuesta => {
          this.svcSpinner.hide();          
          this.data = respuesta;
          this.filteredData = respuesta;
          
        }, () => { }, () => {
        });


  }

  formatFecha(fecha:any){
    if(fecha!=null){      
      return this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm');
    }else{
      return "";
    }
  }

  
  guardaMaterial(){
    console.log(this.materialForm)


    const esValido = this.verificaValido(this.materialForm)
    console.log(esValido)
  if(esValido){
    this.svcSpinner.show();    


    this.svcMateriales.CrearActualizar(this.materialForm).subscribe(respuesta => {
      this.svcSpinner.hide();
            
      Swal.fire({
            icon: 'success',
            title: 'Guardado',            
          }).then((result) => {         
            this.obtenerMateriales()     
          })        
        
      }, () => { }, () => {
      });
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Información incompleta, verifique'       
      })
      
      this.obtenerMateriales()   
  }




  }

  editaMaterial(row: MaterialModel){
    this.materialForm = row
   this.MaterialForm.fire();
  }
  desactivaMaterial(row: MaterialModel){

        Swal.fire({
          title: '¿Desea desactivar el material '+row.Material+' ?',
          text:'',
          showCancelButton: true,
          icon:'question',
          confirmButtonText: 'Desactivar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {        
              
        row.Estatus = 0;
        this.svcMateriales.CrearActualizar(row).subscribe(respuesta => {
          this.svcSpinner.hide();
                
          Swal.fire({
            icon: 'success',
            title: 'Desactivado',            
          }).then((result) => {         
            this.obtenerMateriales()     
          })        
          
        }, () => { }, () => {
        });

      }

    })

  }

  verificaValido(obj:MaterialModel) {
    if(obj.Grupo?.Identificador!=0)
      if(obj.Material!=undefined &&obj.Material!='' )
        if(obj.TextoMaterial!=undefined &&obj.TextoMaterial!='' )
          if(obj.Unidad!=undefined &&obj.Unidad!='' )
            return true;

    return false;
  }


}




export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}


