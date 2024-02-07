import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormAnexoComponent } from './form-anexo/form-anexo.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Direction } from '@angular/cdk/bidi';
import { DatePipe, formatDate } from '@angular/common';
import { AnexoModel } from 'src/models/main';
import { AnexoService } from 'src/services/sifoa/anexo.service';
import { GeneralesModel } from 'src/models/generales';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { MediaService } from 'src/services/sifoa/media.service';

@Component({
  selector: 'app-anexos',
  templateUrl: './anexos.component.html',
  styleUrls: ['./anexos.component.scss'],
})
export class AnexosComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'Folio',
    'Estado',
    'Tipo',
    'Monto',
    'FechaEmision',
    'FechaContable',
    'FechaRegistro',
    'Acciones'
  ];
  
  generales!: GeneralesModel;
  @ViewChild('AgregarMovimiento') public AgregarAnexo!: SwalComponent;
  @ViewChild('EditarAnexo') public EditarAnexo!: SwalComponent;
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  buttonDisabled = false;
  nuevoAnexo: AnexoModel = new AnexoModel()
  modAnexo: AnexoModel = new AnexoModel()

  exampleDatabase?: AnexoService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<AnexoModel>(true, []);
  id?: number;
  teachers?: AnexoModel;
  breadscrums = [
    {
      title: 'All Teacher',
      items: ['Teacher'],
      active: 'All Teacher',
    },
  ];
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog, private datePipe: DatePipe,
    public teachersService: AnexoService,
    private snackBar: MatSnackBar,
    private svcSpinner: NgxSpinnerService,
    private svcMedia: MediaService,
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
     this.modAnexo = this.nuevoAnexo
     this.GuardarAnexo()
  }

  guardaEdita(){
    this.modAnexo = this.nuevoAnexo
    this.Actualizar()
 }


  obtieneEstadoAnexo(elemento: any): string{
    switch(elemento.Estado){
      case 1:
        return "Registrado"
      case 2:
        return "Canjeado"
      default:
        return ""
   }
  }

  CanjearAnexo():void{
    this.modAnexo.FechaCaptura = new Date().toISOString().split('T')[0];

    this.svcSpinner.show();
    this.exampleDatabase?.CanjearAnexo(this.modAnexo).pipe(takeUntil(this.destroy$)).subscribe(AnexoId => {           
      swal.fire({
        title: 'Éxito',
        text: 'Se eliminó el anexo correctamente.',
        icon: 'success'
      });  
      this.svcSpinner.hide()
      this.refresh()
    }, errResponse => {
      this.svcSpinner.hide();
    }, () => {
      this.svcSpinner.hide();
    });


  }


  GuardarAnexo():void{
    this.svcSpinner.show();
    this.modAnexo.FechaCaptura = new Date().toISOString().split('T')[0];
    this.modAnexo.Estado =1;  
  
    this.exampleDatabase?.CrearAnexo(this.modAnexo).subscribe({
      next: (res) => {
        if (res) {            
          this.refresh()
           this.refreshTable();
           swal.fire({
            title: 'Éxito',
            text: 'Anexo creado exitosamente.',
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
  
    this.exampleDatabase?.ActualizarAnexo(this.modAnexo).subscribe({
      next: (res) => {
        if (res) {            
           this.refreshTable();
           swal.fire({
            title: 'Éxito',
            text: 'Se editó el anexo.',
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

  eliminarAnexo(anexo: AnexoModel): void {
      if(anexo.Estado != 1){
        swal.fire({
          title: 'Error',
          text: 'El anexo no se puede eliminar.',
          icon: 'info'
        });
      }else{
  
        swal.fire({
          title: "Eliminar",
            icon: 'question',
           text:"¿Desea eliminar el anexo?",
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
               
            anexo.Estatus = 0 ;
            this.svcSpinner.show();
            this.exampleDatabase?.ActualizarAnexo(anexo).subscribe({
                next: (res) => {
                  if (res) {            
                     this.refreshTable();
                     swal.fire({
                      title: 'Éxito',
                      text: 'Se eliminó el anexo.',
                      icon: 'success'
                    });     
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
    
  ImprimeAnexo(anexo: AnexoModel):void{
    this.svcSpinner.show()
    this.exampleDatabase?.ImprimeAnexo(anexo).subscribe((data) => {
      this.svcMedia.openFile(data);
      this.svcMedia.downloadFile(data, 'CertificadoRenta'+anexo.Folio+'.pdf');
      this.svcSpinner.hide();
      }, error => console.log('Error downloading the file.'),
      () => {
    });       
  }



  refresh() {
    this.loadData();
  }
  addNew() {
    this.nuevoAnexo = new AnexoModel();
    this.nuevoAnexo.Identificador = 0;
    this.nuevoAnexo.Expediente.Identificador = this.generales.Expediente.Identificador;
    this.nuevoAnexo.CP = '';
    this.nuevoAnexo.Telefono = '';
    this.nuevoAnexo.Observaciones = '';
    this.nuevoAnexo.Estatus = 1;
    this.nuevoAnexo.Estado = 1;
    this.AgregarAnexo.fire()
  }
  asignaObjeto(event:AnexoModel){
    this.nuevoAnexo = event
  }
  
  editCall(row: AnexoModel) {
    this.nuevoAnexo = row
    this.EditarAnexo.fire()

  }
  deleteItem(row: AnexoModel) {
  /*  this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });*/
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
    console.log(buttonDisabled)
    this.buttonDisabled = buttonDisabled;
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<AnexoModel>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.exampleDatabase = new AnexoService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
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
  onContextMenu(event: MouseEvent, item: AnexoModel) {
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
    // console.log(fecha)
     return this.datePipe.transform(fecha, 'dd/MM/yyyy');
   }
  

}



export class ExampleDataSource extends DataSource<AnexoModel> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: AnexoModel[] = [];
  renderedData: AnexoModel[] = [];
  
  generales!: GeneralesModel;
  constructor(
    public exampleDatabase: AnexoService,
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

  construirAnexo(): AnexoModel {
    const anexo = new AnexoModel();
    anexo.Expediente.Identificador = this.generales.Expediente.Identificador;
    return anexo;
  }


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<AnexoModel[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.ObtenerAnexos(this.construirAnexo());
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        if(this.exampleDatabase.data){
          this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((teachers: AnexoModel) => {
            const searchStr = (
              teachers.Folio +
              teachers.Estado +
              teachers.Monto +
              teachers.FechaEmision +
              teachers.FechaContable 
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
  sortData(data: AnexoModel[]): AnexoModel[] {
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
          [propertyA, propertyB] = [a.Monto, b.Monto];
          break;
        case 'FechaEmision':
          [propertyA, propertyB] = [a.FechaEmision, b.FechaEmision];
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
