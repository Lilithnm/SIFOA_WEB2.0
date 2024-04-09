import { Component, OnInit,ViewChild, Input, Inject, Optional, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import swal, { SweetAlertResult } from 'sweetalert2';
import { Subject } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { LiberarConfirmComponent } from 'src/app/shared/liberar-confirm/liberar-confirm.component';


import { DatePipe, formatDate } from '@angular/common';
import { BeneficiarioModel, DepositoModel, DevolucionModel, GarantiaModel, MultaModel } from 'src/models/main';
import { DepositoService } from 'src/services/sifoa/deposito.service';
import { DevolucionService } from 'src/services/sifoa/devolucion.service';
import { MediaService } from 'src/services/sifoa/media.service';
import { MultaService } from 'src/services/sifoa/multa.service';
import { Functions } from 'src/tools/functions';
import { FormularioDevolucionComponent } from './form-devolucion/formulario-devolucion.component';

@Component({
  selector: 'app-devolucion',
  templateUrl: './devolucion.component.html',
  styleUrls: ['./devolucion.component.scss']
})
export class DevolucionComponent implements OnInit {

  @ViewChild('devolucion') private devolucionSw!: SwalComponent;


  @Input() modGarantiaDevo: GarantiaModel = new GarantiaModel();

  destroy$: Subject<boolean> = new Subject<boolean>();

  devolucionObt: DevolucionModel = new DevolucionModel();
  devolucionsLista:  DevolucionModel[]=[];
  devolucionCapt: DevolucionModel= new DevolucionModel();

  //devolucionesLst: DevolucionModel[] = [];
  displayedColumns = [
    'Referencia',
    'Monto',
    'Tipo',
    'Endosada',
    'Liberada',
    'Finalizada',
    'Conciliada',
    'Botones'
  ];

  dataSource: MatTableDataSource<DevolucionModel> = new MatTableDataSource<DevolucionModel>;

  sumaMontosDepositos: number = 0;
  sumaMontosDevoluciones: number = 0;
  devolucionModel: DevolucionModel= new DevolucionModel();

  nuevaDevolucion: boolean = true;
  depositoObt: DepositoModel = new DepositoModel();
  depositosLista:  DepositoModel[]=[];
  
  
  public form: FormGroup = Object.create(null);
  constructor(private svcDepositos: DepositoService, private svcDevoluciones: DevolucionService,    
    private svcMedia: MediaService,  private svcMultas: MultaService,    
    private svcDevolucion: DevolucionService, private svcSpinner: NgxSpinnerService,
    private datePipe: DatePipe,
     public dialog: MatDialog, 
    private toolFunctions: Functions) {

     
  }

  ngOnInit(): void { 
    
      this.devolucionModel.Identificador=0;
       //objeto para obtener todos los correspondientes a la garantia
       this.devolucionObt.IdGarantia=this.modGarantiaDevo.Identificador;
       this.depositoObt.IdGarantia=this.modGarantiaDevo.Identificador;

       this.obtenerDevoluciones()
       this.obtenerDepositos()    
  }

  verificaVigencia(devolucion: DevolucionModel): boolean{
    let vigente = formatDate(new Date(devolucion.FechaVigencia),'yyyy-MM-dd','en_US') > formatDate( new Date(),'yyyy-MM-dd','en_US');
    vigente = !vigente;
    return vigente && devolucion.FechaConciliacionSap==null
  }
  ObtieneTooltip(devolucion: DevolucionModel): string{
    let vigente = formatDate(new Date(devolucion.FechaVigencia),'yyyy-MM-dd','en_US') > formatDate( new Date(),'yyyy-MM-dd','en_US');
    let reactivado =  devolucion.Reactivaciones>0;
    if(devolucion.Estado >3)
    return ""
    if(vigente === false && !reactivado)
      return "Devolución vencida"
    if(reactivado)
      return "Devolución reactivada"
    
    return "";
  }
  obtenerDevoluciones(){
    this.sumaMontosDevoluciones=0;
    this.svcSpinner.show();
    this.svcDevoluciones.ObtenerDevoluciones(this.devolucionObt).subscribe(response => {
      if(response){
        this.dataSource.data = response
        let v = this;
        response.map(function(devo) {
          v.sumaMontosDevoluciones += devo.Monto;
       });
      }
    }, errResponse => {
      this.svcSpinner.hide();      
    }, () => {
      this.svcSpinner.hide();      
    });
}

modificarEndoso(devolucion: DevolucionModel){
  this.devolucionModel = devolucion
  this.crearDevolucion()
}

crearDevolucion(){
    const dialogRef = this.dialog.open(FormularioDevolucionComponent, 
      {width: '80vw',
      maxWidth: '100vw',
      disableClose: true, 
      data: {
        gara: this.modGarantiaDevo,
        devolucion: this.devolucionModel,
        totalDepositos: this.modGarantiaDevo.MontoDepositos,
        totalDevoluciones: this.modGarantiaDevo.MontoDevoluciones
      }
    });
    
  }

  getTipo(tipo:DevolucionModel){
    switch(tipo.Tipo){
      case 1:
        return this.obtieneBeneficiario(tipo)
      break;
      case 2:
        return 'A FAVOR DEL PODER JUDICIAL';
      break;
      case 3:
        return 'COMO MULTA ORDINARIA';
      break;
    }
    return""
}
obtieneBeneficiario(dev: DevolucionModel){
  if(dev.Beneficiarios[0].NombreEmpleado!=""&&dev.Beneficiarios[0].NombreEmpleado!=null){
    return "Empleado: "+ dev.Beneficiarios[0].NombreEmpleado;
  }else{
    
    return "Beneficiario: "+ dev.Beneficiarios[0].Personaje.Nombre+" "+dev.Beneficiarios[0].Personaje.Paterno+" "+dev.Beneficiarios[0].Personaje.Materno;
  }
}

  liberar(devolucion: DevolucionModel){
    if(devolucion.Tipo == 1){
      
        this.dialog
        .open(LiberarConfirmComponent, {
            data: {Beneficiarios: devolucion.ListaCoincidencias}
          })
          .afterClosed()
          .subscribe((confirmado: Boolean) => {
            if (confirmado) {        
              this.devolucionModel = devolucion;
              this.devolucionModel.FechaLiberacion = new Date().toISOString().split('T')[0] ;
              this.devolucionModel.Estado = 2;
              this.Guardar()
              this.dialog.closeAll()
            } 
          });

    }else{
      
    this.dialog
    .open(ModalConfirmComponent, {
      data: {Title: 'Liberar', Text: '¿Desea liberar la devolución?'}
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {        
        this.devolucionModel = devolucion;
        this.devolucionModel.FechaLiberacion = new Date().toISOString().split('T')[0] ;
        this.devolucionModel.Estado = 2;
        this.Guardar()
        this.dialog.closeAll()
      } 
    });


    }
    
 }

 beneficiarios(beneficiarios: BeneficiarioModel[]){
    let empleado="¿Ratifica a los beneficiarios? \n";
    if(beneficiarios){
        beneficiarios.map(function(obj){
          if(obj.NoEmpleado>0){
            empleado+="\n Empleado: "+obj.NombreEmpleado+"\n";
          }
          else{
            empleado+="\n Beneficiario: "+obj.Personaje.Nombre+" "+obj.Personaje.Paterno+" "+obj.Personaje.Materno+"\n";
          }
      });
      }
    
    return empleado;
}

 finalizar(devolucionD: DevolucionModel){
  const dialogRef = this.dialog.open(FormularioDevolucionComponent, 
    {width: '80vw',
    maxWidth: '100vw',
    disableClose: true, 
    data: {
      devolucion: devolucionD
    }
  });

 }
 anular(devolucionD: DevolucionModel){

 /*   swal.fire({
    title: 'Anular',
    text: "¿Desea anular la devolución?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Anular',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.verificaAnula(devolucionD)
    }
  });*/

  this.dialog
  .open(ModalConfirmComponent, {
    data: { Title: 'Anular',    Text: "¿Desea anular la devolución?"}
  })
  .afterClosed()
  .subscribe((confirmado: Boolean) => {
    if (confirmado) {     
      this.verificaAnula(devolucionD)
      this.dialog.closeAll()
    } 
  });

 }

 imprimir(devolucion: DevolucionModel){
  this.svcSpinner.show()
    this.svcDevolucion.ObtenerOrdenDevolucion(devolucion).subscribe((data) => {
      this.svcMedia.openFile(data);
      this.svcMedia.downloadFile(data, 'Devolucion'+devolucion.ReferenciaDevolucion+'.pdf');
      this.svcSpinner.hide();
    }, error => console.log('Error downloading the file.'),
    () => {
    this.svcSpinner.hide();
  });       

 }

 verificaAnula(devolucionD: DevolucionModel){
    this.svcSpinner.show();

    if(devolucionD.Estado==1 || devolucionD.Estado==3){

      this.svcDevoluciones.Anular(devolucionD).pipe(takeUntil(this.destroy$)).subscribe(response => {
        swal.fire({
          title: 'Éxito',
          text: 'Devolución anulada',
          icon: 'success'
        });
      
      }, errResponse => {
        this.svcSpinner.hide();      
      }, () => {
        this.svcSpinner.hide();      
      });
    }else{
      devolucionD.Estado=1;
      devolucionD.FechaLiberacion="1753-01-01";
      this.svcDevoluciones.Actualizar(devolucionD).pipe(takeUntil(this.destroy$)).subscribe(response => {
        swal.fire({
          title: 'Éxito',
          text: 'Devolución anulada',
          icon: 'success'
        });
      }, errResponse => {
        this.svcSpinner.hide();      
      }, () => {
        this.svcSpinner.hide();      
      });

    }
 }
 

 Guardar(){
  this.svcDevoluciones.Actualizar(this.devolucionModel).pipe(takeUntil(this.destroy$)).subscribe(response => {
    if(response){
      this.dataSource.data = response
      swal.fire({
        title: 'Éxito',
        text: 'Devolución liberada correctamente.',
        icon: 'success'
      });
      
      //this.dialog.closeAll()

    }
  }, errResponse => {
    this.svcSpinner.hide();      
  }, () => {
    this.svcSpinner.hide();      
  });
 }

 Eliminar(devolucion: DevolucionModel){
  this.dialog
  .open(ModalConfirmComponent, {
    data: {Title: 'Eliminar', Text: '¿Desea eliminar el endoso?'}
  })
  .afterClosed()
  .subscribe((confirmado: Boolean) => {
    if (confirmado) {        
      if(devolucion.Beneficiarios?.length==1)
        devolucion.Beneficiarios[0].Estatus=0;

      devolucion.Estatus=0;

      this.sumaMontosDevoluciones-= devolucion.Monto;

      this.svcDevoluciones.Actualizar(devolucion).pipe(takeUntil(this.destroy$)).subscribe(response => {
        if(response){
        
          this.dialog.closeAll() 
          this.dialog.open(ModalComponent, {
            width: '500px',
            data: {Title: 'Éxito', Text: 'El endoso fue eliminado.'}
          });  
        
        }
        
  
      }, errResponse => {
        this.svcSpinner.hide();      
      }, () => {
        this.svcSpinner.hide();      
      });
       

    } 
  });
  
 }

 EliminarMulta(devolucion: DevolucionModel){
//8000079 

let multaModel: MultaModel=new MultaModel;
      
multaModel.Identificador = devolucion.IdMultaGenerada;

//multaModel.Identificador = devolucion.IdMultaGenerada;

   this.dialog
   .open(ModalConfirmComponent, {
     data: {Title: 'Eliminar', Text: '¿Desea eliminar el endoso?'}
   })
   .afterClosed()
   .subscribe((confirmado: Boolean) => {
     if (confirmado) {  
      ///////////////////busca y elimina la multa correspondiente

          this.svcMultas.ObtenerMulta(multaModel).pipe(takeUntil(this.destroy$)).subscribe(multa => {            
            multa.Estatus=0;
            this.svcMultas.ActualizaMulta(multa).pipe(takeUntil(this.destroy$)).subscribe(multa => {  
            }, errResponse => {
              this.svcSpinner.hide();      
            }, () => {
              this.svcSpinner.hide();      
            });
  
          }, errResponse => {
            this.svcSpinner.hide();      
          }, () => {
            this.svcSpinner.hide();      
          });
      /////////////elimina la devolucion
       devolucion.Estatus=0;
       
      this.sumaMontosDevoluciones-= devolucion.Monto;
 
       this.svcDevoluciones.Actualizar(devolucion).pipe(takeUntil(this.destroy$)).subscribe(response => {
         if(response){
           this.dialog.open(ModalComponent, {
             width: '500px',
             data: {Title: 'Éxito', Text: 'El endoso fue eliminado.'}
           });  
           this.obtenerDevoluciones();
         }
         
   
       }, errResponse => {
         this.svcSpinner.hide();      
       }, () => {
         this.svcSpinner.hide();      
       });
        
 
     } 
   });
  
   


 }



 obtenerDepositos(){
  this.svcSpinner.show();
  this.svcDepositos.ObtenerDepositos(this.depositoObt).pipe(takeUntil(this.destroy$)).subscribe(response => {
    if(response){
      this.depositosLista = response
      let v = this;
      response.map(function(deposito) {
        v.sumaMontosDepositos += deposito.Monto;
     });
    }
  }, errResponse => {
    this.svcSpinner.hide();      
  }, () => {
    this.svcSpinner.hide();      
  });
}

  verDetalle(){

  }

  obtieneFecha(fecha:string){
    let fechanueva="";
    if(fecha){
      if(formatDate(new Date(fecha),'yyyy-MM-dd','en_US') > formatDate('1900-01-01','yyyy-MM-dd','en_US')){
        fechanueva=formatDate(new Date(fecha),'dd/MM/yyyy','en_US');
      }
    }
    return fechanueva;
  }

  formatFecha(fecha:string){
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }


}
