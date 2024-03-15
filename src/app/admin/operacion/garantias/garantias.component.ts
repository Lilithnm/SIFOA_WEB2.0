import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import swal from 'sweetalert2';
import {  MatSnackBar,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DatePipe } from '@angular/common';
import { GarantiaModel } from 'src/models/main';
import { GarantiaService } from 'src/services/sifoa/garantia.service';
import { GeneralesModel } from 'src/models/generales';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { MediaService } from 'src/services/sifoa/media.service';
import { HistorialService } from 'src/services/sifoa/historial.service';

@Component({
  selector: 'app-garantias',
  templateUrl: './garantias.component.html',
  styleUrls: ['./garantias.component.scss'],
})
export class GarantiasComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'Folio',
    'Estado',
    'FolioRenta',
    'Monto',
    'Depositado',
    'Devuelto',    
    'FechaEmision',
    'Acciones'
  ];
  
  generales!: GeneralesModel;
  @ViewChild('Agregar') public Agregar!: SwalComponent;
  @ViewChild('Editar') public Editar!: SwalComponent;
  @ViewChild('Depositos') public Depositos!: SwalComponent;
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  buttonDisabled = false;
  nuevaGara: GarantiaModel = new GarantiaModel()
  modgarantia: GarantiaModel = new GarantiaModel()

  garantiasSvc?: GarantiaService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<GarantiaModel>(true, []);
  id?: number;
  garantias?: GarantiaModel;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog, private datePipe: DatePipe,
    public garantiasService: GarantiaService,
    private snackBar: MatSnackBar,
    private svcSpinner: NgxSpinnerService,
    private svcMedia: MediaService,
    private svcHistorial: HistorialService
  ) {
    
    super();
    if (localStorage.getItem('Generales'))
    {
      this.generales = JSON.parse(localStorage['Generales']);
    }
  }
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild('filter', { static: true }) filter!: ElementRef;
    @ViewChild(MatMenuTrigger)
    contextMenu?: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };

    ngOnInit() {
      this.loadData();
    }
    agregaMovimiento(){
     this.modgarantia = this.nuevaGara
     this.Guardargarantia()
  }

  guardaEdita(){
    this.modgarantia = this.nuevaGara
    this.Actualizar()
 }


  obtieneEstado(elemento: any): string{
    switch(elemento.Estado){
      case 1:
        return "Expedida"
      case 2:
        return "Iniciada"
      case 3:
        return "Finalizada"
      default:
        return ""  
   }
  }



  Guardargarantia():void{
    this.svcSpinner.show();
    this.modgarantia.FechaCaptura = new Date().toISOString().split('T')[0];
    
    this.nuevaGara.Estatus = 1;
    this.nuevaGara.Estado = 1;
  
    this.garantiasSvc?.CrearGarantia(this.modgarantia).subscribe({
      next: (res) => {
        if (res) {            
          this.refresh()
           this.refreshTable();
           swal.fire({
            title: 'Éxito',
            text: 'garantia creado exitosamente.',
            icon: 'success'
          });     
        } else {
          this.svcSpinner.hide()
          this.showNotification(
            'snackbar-error',
            'Error',
            'bottom',
            'center'
          );
        }
      },
      error: (error) => {
        this.svcSpinner.hide()         
         this.showNotification(
          'snackbar-error',
          'Error',
          'bottom',
          'center'
        );
      },
    });
  }
  Actualizar():void{
    this.svcSpinner.show();
  
    this.modgarantia.FechaCaptura = new Date().toISOString().split('T')[0];
    this.garantiasSvc?.ActualizarGarantia(this.modgarantia).subscribe({
      next: (res) => {
        if (res) {            
           swal.fire({
            title: 'Éxito',
            text: 'Se editó el garantia.',
            icon: 'success'
          });     
          
          this.refresh()
           this.refreshTable();
        } else {
          this.svcSpinner.hide()
          this.showNotification(
            'snackbar-error',
            'Error',
            'bottom',
            'center'
          );
        }
      },
      error: (error) => {
        this.svcSpinner.hide()         
         this.showNotification(
          'snackbar-error',
          'Error',
          'bottom',
          'center'
        );
      },
    });
  }

  eliminarGarantia(garantia: GarantiaModel): void {
      if(garantia.Estado != 1){
        swal.fire({
          title: 'Error',
          text: 'El garantia no se puede eliminar.',
          icon: 'info'
        });
      }else{
  
        swal.fire({
          title: "Eliminar",
            icon: 'question',
           text:"¿Desea eliminar el garantia?",
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
               
            garantia.Estatus = 0 ;
            this.svcSpinner.show();
            this.garantiasSvc?.ActualizarGarantia(garantia).subscribe({
                next: (res) => {
                  if (res) {            
                     swal.fire({
                      title: 'Éxito',
                      text: 'Se eliminó el garantia.',
                      icon: 'success'
                    });     
                    this.refresh()
                     this.refreshTable();
                    this.svcSpinner.hide()
                  } else {
                    this.svcSpinner.hide()
                    this.showNotification(
                      'snackbar-error',
                      'Error',
                      'bottom',
                      'center'
                    );
                  }
                },
                error: (error) => {
                  this.svcSpinner.hide()         
                   this.showNotification(
                    'snackbar-error',
                    'Error',
                    'bottom',
                    'center'
                  );
                },
              });
          }
        })
      
      }
    }


  ImprimeGarantia(garantia: GarantiaModel):void{
    this.svcSpinner.show()
    this.garantiasSvc?.ObtenerOrdenGarantia(garantia).subscribe({
      next: (data) => {
      this.svcMedia.openFile(data);
      this.svcMedia.downloadFile(data, 'Garantia'+garantia.Folio+'.pdf');
      this.svcSpinner.hide();
      },
      error: (error) => {
        this.svcSpinner.hide()         
         this.showNotification(
          'snackbar-error',
          'Error',
          'bottom',
          'center'
        );
      },
    });
       
  }

  ImprimeHistorial(garantia: GarantiaModel):void{
    this.svcSpinner.show()

    this.svcHistorial.HistorialGarantia(garantia).subscribe({
      next: (data) => {
        this.svcMedia.openFile(data);
        this.svcMedia.downloadFile(data, 'Historialarantia'+garantia.Folio+'.pdf');
        this.svcSpinner.hide();
      },
      error: (error) => {
        this.svcSpinner.hide()         
         this.showNotification(
          'snackbar-error',
          'Error',
          'bottom',
          'center'
        );
      },
    });
    
       
  }
  abreDepositos(garantia: GarantiaModel){
    this.nuevaGara = garantia;
    this.Depositos.fire();
  }
  


  refresh() {
    this.loadData();
  }
  addNew() {
    this.nuevaGara = new GarantiaModel();
    this.nuevaGara.Identificador = 0;
    this.nuevaGara.Expediente.Identificador = this.generales.Expediente.Identificador;
    this.nuevaGara.CP = '';
    this.nuevaGara.Telefono = '';
    this.nuevaGara.Observaciones = '';
    this.nuevaGara.Estatus = 1;
    this.nuevaGara.Concepto.Identificador=0;
    this.nuevaGara.Anexo.Identificador = 0;
    this.nuevaGara.Estado = 1;

    this.Agregar.fire()
  }
  asignaObjeto(event:GarantiaModel){
    this.nuevaGara = event
  }
  
  editCall(row: GarantiaModel) {
    this.nuevaGara = row
    this.Editar.fire()
  } 
  
  muestraDepositos(row: GarantiaModel) {
    this.nuevaGara = row
    this.Depositos.fire()

  }


  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  onButtonDisabled(buttonDisabled:boolean) {
    this.buttonDisabled = buttonDisabled;
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      this.garantiasSvc?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<GarantiaModel>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.garantiasSvc = new GarantiaService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.garantiasSvc,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: GarantiaModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  formatFecha(fecha:string){
     return this.datePipe.transform(fecha, 'dd/MM/yyyy');
   }
  

}



export class ExampleDataSource extends DataSource<GarantiaModel> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: GarantiaModel[] = [];
  renderedData: GarantiaModel[] = [];
  
  generales!: GeneralesModel;
  constructor(
    public garantiasSvc: GarantiaService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    if (localStorage.getItem('Generales'))
    {
      this.generales = JSON.parse(localStorage['Generales']);
    }
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  construirgarantia(): GarantiaModel {
    const garantia = new GarantiaModel();
    garantia.Expediente.Identificador = this.generales.Expediente.Identificador;
    return garantia;
  }


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<GarantiaModel[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.garantiasSvc.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.garantiasSvc.ObtenerGarantias(this.construirgarantia());
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        if(this.garantiasSvc.data){
          this.filteredData = this.garantiasSvc.data
          .slice()
          .filter((garantias: GarantiaModel) => {
            const searchStr = (
              garantias.Folio +
              garantias.Estado +
              garantias.Anexo.Descripcion +
              garantias.Importe +
              garantias.MontoDepositos 
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        }

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: GarantiaModel[]): GarantiaModel[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'Folio':
          [propertyA, propertyB] = [a.Folio, b.Folio];
          break;
        case 'Monto':
          [propertyA, propertyB] = [a.Importe, b.Importe];
          break;
        case 'FechaEmision':
          [propertyA, propertyB] = [a.Fecha, b.Fecha];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
  
}
