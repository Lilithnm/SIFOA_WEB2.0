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
import { DatePipe } from '@angular/common';
import { SolicitudMaterialesModel } from 'src/models/main';
import { CentrosModel } from 'src/models/generales';
import { CentrosPeriodosService } from 'src/services/materiales/centros-periodos';
@Component({
  selector: 'app-adminperiodos-tabla',
  templateUrl: './administra-periodos.component.html',
  styleUrls: ['./administra-periodos.component.scss'],
})
export class AdministraPeriodosComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  
  

  rows = [];
  selectedRowData?: selectRowInterface;
  newUserImg = 'assets/images/user/user1.jpg';
  data: CentrosModel[] = [];
  filteredData: CentrosModel[] = [];
  editForm: UntypedFormGroup;
  register?: UntypedFormGroup;
  selectedOption?: string;
  SortType = SortType;
  
  
  listaMateriales:SolicitudMaterialesModel[]=[];
  solicitudAdmin: CentrosModel = new CentrosModel(0);
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  breadscrums = [
    {
      title: 'Periodos',
      items: [],
      active: 'Administrar Periodos de solicitud',
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar, // private modalService: NgbModal
    private router: Router,
    private svcSpinner: NgxSpinnerService,
    private svcCentros: CentrosPeriodosService,
    private datePipe: DatePipe,
  ) {
    this.editForm = this.fb.group({
      id: new UntypedFormControl(),
      img: new UntypedFormControl(),
      firstName: new UntypedFormControl(),
      lastName: new UntypedFormControl(),
      phone: new UntypedFormControl(),
      email: new UntypedFormControl(),
      address: new UntypedFormControl(),
    });
  }
  ngOnInit() {
      this.ObtenerCentrosPeriodos();

    this.register = this.fb.group({
      id: [''],
      img: [''],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: [''],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      address: [''],
    });
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

  
  obtieneEstadoSolicitud(elemento: any): string{
    switch(elemento.Estado){
      case 1:
        return "Registrado"
      case 2:
        return "Canjeado"
      default:
        return ""
   }
  }


  abrirPeriodo(row: CentrosModel){
    Swal.fire({
      title: '¿Desea abrir el periodo de solicitudes de  '+row.CentroMateriales.Descripcion+' ?',
      text: row.CentroMateriales.CentroCosto,
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Abrir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {     
        row.Periodo = 1;
        ////////////////****************************//////// */
        this.svcCentros.ActualizaPeriodo(row).subscribe({
          next: (res) => {
            if (res) {
              this.data = res;
              this.filteredData = res;
              this.svcSpinner.hide();  
              Swal.fire({
                icon: 'success',
                title: 'Actualizado',            
              })
            } else {
              this.svcSpinner.hide();     
            }
          },
          error: (error) => {
            this.svcSpinner.hide();          
          },
        });

        }
    })
  }
  
  cerrarPeriodo(row: CentrosModel){
    Swal.fire({
      title: '¿Desea cerrar el periodo de solicitudes de  '+row.CentroMateriales.Descripcion+' ?',
      text: row.CentroMateriales.CentroCosto,
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {      
          row.Periodo = 0;
          ////////////////****************************//////// */
          this.svcCentros.ActualizaPeriodo(row).subscribe({
            next: (res) => {
              if (res) {
                this.data = res;
                this.filteredData = res;
                Swal.fire({
                  icon: 'success',
                  title: 'Actualizado',            
                })
                this.svcSpinner.hide();  
              } else {
                this.svcSpinner.hide();     
              }
            },
            error: (error) => {
              this.svcSpinner.hide();          
            },
          });

        }
    })
  }

  
  cerrarTodos(){
    Swal.fire({
      title: '¿Desea cerrar el periodo de solicitudes de  todos los centros ?',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {    
          ////////////////****************************//////// */
          this.svcCentros.CierraPeriodo(this.data).subscribe({
            next: (res) => {
              if (res) {
                this.data = res;
                this.filteredData = res;
                Swal.fire({
                  icon: 'success',
                  title: 'Actualizados',            
                })
                this.svcSpinner.hide();  
              } else {
                this.svcSpinner.hide();     
              }
            },
            error: (error) => {
              this.svcSpinner.hide();          
            },
          });

        }
    })
  }

  abrirTodos(){
    Swal.fire({
      title: '¿Desea abrir el periodo de solicitudes de  todos los centros ?',
      showCancelButton: true,
      icon:'question',
      confirmButtonText: 'Abrir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     if (result.isConfirmed) {    
          ////////////////****************************//////// */
          this.svcCentros.AbrePeriodo(this.data).subscribe({
            next: (res) => {
              if (res) {
                this.data = res;
                this.filteredData = res;
                Swal.fire({
                  icon: 'success',
                  title: 'Actualizados',            
                })
                this.svcSpinner.hide();  
              } else {
                this.svcSpinner.hide();     
              }
            },
            error: (error) => {
              this.svcSpinner.hide();          
            },
          });

        }
    })
  }

  

  ObtenerCentrosPeriodos(){
    this.svcSpinner.show();


    this.svcCentros.ObtenerAdmin().subscribe({
      next: (res) => {
        if (res) {
          this.data = res;
          this.filteredData = res;
          this.svcSpinner.hide();   
        } else {
          this.svcSpinner.hide();          

        }
      },
      error: (error) => {
        this.svcSpinner.hide();          
      },
    });
    
  }

  formatFecha(fecha:any){
    if(fecha!=null){      
      return this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm');
    }else{
      return "";
    }
  }


}




export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}


