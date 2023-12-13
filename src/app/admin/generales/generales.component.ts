import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PersonajesComponent } from './personajes/personajes.component';
import swal, { SweetAlertResult } from 'sweetalert2';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ExpedienteBaseModel, ExpedienteModel, GeneralesModel, PersonajeModel } from 'src/models/generales';
import { TransferenciaModel } from 'src/models/main';
import { AccionesModel, InformacionTablaModel } from 'src/models/modelos';
import { PersonajesService } from 'src/services/sifoa/personajes.service';
import { GeneralesService } from 'src/services/sifoa/generales.service';
import { TransferenciaService } from 'src/services/sifoa/transferencia.service';
import { CentrosModel, TipoExpedienteModel } from 'src/models/catalogos';
import { ConfirmExpedienteComponent } from 'src/app/shared/confirm-expediente/confirm-expediente.component';
@Component({
  selector: 'app-generales',
  templateUrl: './generales.component.html',
  styleUrls: ['./generales.component.scss']
})
export class GeneralesComponent implements  OnInit, OnChanges {

  destroy$: Subject<boolean> = new Subject<boolean>();
  modGenerales!: GeneralesModel;
  Delitos = 'Delitos';
  
  modEncabezados = new InformacionTablaModel();

  transferenciaObt= new TransferenciaModel();
  
  arrData: PersonajeModel[] = [];

  @ViewChild('Personajes') private PersonajesSw!: SwalComponent;
  constructor(private dialog: MatDialog,
    private svcPersonaje: PersonajesService, 
    private svcGenerales: GeneralesService,
    private router: Router,
    private svcTransferencia: TransferenciaService) {

    
    this.modGenerales = new GeneralesModel();
    this.modGenerales.Expediente = new ExpedienteModel();
    this.modGenerales.Expediente.TipoExpediente = new TipoExpedienteModel();
    this.inicializaPers()
    this.obtenerTransferenciasEnviadas()
    this.obtenerTransferencias()

    this.modEncabezados.Nombres = ['Nombre'];
       this.modEncabezados.Propiedades = [
        'RFC',
        'EditarEliminar']; 

  }

  informacionExpediente(){
    
    let texto="Verifique que se encuentra en el expediente correcto antes de continuar. Una vez que capture los documentos no habrá cambios de expediente.\n";
    let texto2=this.modGenerales.Expediente.TipoExpediente.Descripcion;   
    let texto3=this.modGenerales.Expediente.Nomenclatura;   

   this.dialog
    .open(ConfirmExpedienteComponent, {
      data: {Title: 'Bienvenido', Text:texto, Text2:texto2, Text3: texto3}
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {

    });
  
  }

  inicializaPers(){
    this.modGenerales = JSON.parse(localStorage.getItem('Generales')|| '{}');
    this.svcGenerales.ObtenerGenerales(this.modGenerales.Expediente).pipe(takeUntil(this.destroy$)).
                subscribe(generales => {
                  localStorage.setItem('Generales', JSON.stringify(generales));
                  localStorage.setItem('IdExpediente', generales.Expediente.Identificador.toString());

                  
                  this.modGenerales = JSON.parse(localStorage.getItem('Generales')|| '{}');
                  this.arrData = this.modGenerales.Personajes.map(current => {
                    let data = new PersonajeModel();
                        data = current;
                        data.RFC = current.Nombre+" "+data.Paterno+" "+data.Materno
                    return data;
                  });
                  
                  console.log(this.arrData)
              });
    this.informacionExpediente();
  }
  controlarAcciones(modAccion: AccionesModel): void {
    switch (modAccion.name) {
      case 'nuevo':
        this.agregar();
        break;
      case 'editar':
        this.editar(modAccion.element);
        break;
      case 'eliminar':
        this.eliminar(modAccion.element);
        break;
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modGenerales'].currentValue !== changes['modGenerales'].previousValue)
    {
      this.Delitos = (this.modGenerales.Expediente.Sistema !== 12 && this.modGenerales.Expediente.Sistema !== 13)  ? 'Delitos' : 'Acciones procesales';
    }
  }

  ngOnInit(): void {
  }

  agregar(){
    const dialogRef = this.dialog.open(PersonajesComponent, 
      {width: '90vw',
        maxWidth: '150vw',
        disableClose: true
    });
    
    dialogRef.afterClosed().subscribe(() => {
      this.inicializaPers()
     });  

  }

  editar(personaje: PersonajeModel){

    const dialogRef = this.dialog.open(PersonajesComponent, 
      {width: '90vw',
        maxWidth: '150vw',
        disableClose: true,
        data: personaje
    });

    dialogRef.afterClosed().subscribe(() => {
      this.inicializaPers()
     });  

  }
  eliminar(personaje: PersonajeModel){
    swal.fire({
      title: 'Eliminar',
      text:'¿Está seguro de eliminar el personaje?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText:'Cerrar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.svcPersonaje.Eliminar(personaje).subscribe(response => {    
            console.log(response)    
            if(response){
              swal.fire({
                title: 'Éxito',
                text: 'Personaje eliminado.',
                icon: 'success'
              });            
              //actualizar expedientee en el almacenamiento
              this.inicializaPers()
  
            }  else{
              swal.fire({
                title: 'Error',
                text: 'El personaje no se puede eliminar',
                icon: 'info'
              });  
            }
            })
        }
      })

  }


  obtenerTransferencias(){
     
    this.transferenciaObt.ExpedienteOrigen = new ExpedienteBaseModel();
    this.transferenciaObt.ExpedienteOrigen.Centro = new CentrosModel();
    this.transferenciaObt.ExpedienteDestino = new ExpedienteBaseModel();
    this.transferenciaObt.ExpedienteDestino.Centro = new CentrosModel();
    
    this.transferenciaObt.ExpedienteDestino.Centro.CentroDgti.Identificador = this.modGenerales.Expediente.Centro.CentroDgti.UbicacionesId;
    this.transferenciaObt.ExpedienteDestino.Centro.CentroDgti.Descripcion = "";
    this.transferenciaObt.ExpedienteOrigen.Centro.CentroDgti.Identificador = 0;
    this.transferenciaObt.Estado = 1;
    this.svcTransferencia.ObtenerTransferencias(this.transferenciaObt).pipe(takeUntil(this.destroy$)).subscribe(resultado => {
      if(resultado){
        ////
        swal.fire({
          title: 'Transferencias',
          text:'Tiene transferencas pendientes',
          showCancelButton: true,
          confirmButtonText: 'Ir',
          cancelButtonText:'Cerrar',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              /////enviar a aceptar transferencias  
              
              this.router.navigate(['/TransferenciasRecibidas']);
            }
          })


      }

      });
    }


    obtenerTransferenciasEnviadas(){     
                
      this.transferenciaObt.ExpedienteOrigen = new ExpedienteBaseModel();
      this.transferenciaObt.ExpedienteOrigen.Centro = new CentrosModel();
      this.transferenciaObt.ExpedienteDestino = new ExpedienteBaseModel();
      this.transferenciaObt.ExpedienteDestino.Centro = new CentrosModel();
      
      this.transferenciaObt.ExpedienteOrigen.Centro.CentroDgti.Identificador = this.modGenerales.Expediente.Centro.CentroDgti.UbicacionesId;
      
      this.transferenciaObt.ExpedienteDestino.Centro.CentroDgti.Descripcion = "";
      this.transferenciaObt.ExpedienteDestino.Centro.CentroDgti.Identificador = 0;
      this.transferenciaObt.Estado = 1;
      this.svcTransferencia.ObtenerTransferencias(this.transferenciaObt).pipe(takeUntil(this.destroy$)).subscribe(resultado => {
        if(resultado!=null){
            console.log(resultado)
            console.log(this.modGenerales)
            let esteExpediente = false;
            resultado.map(transferencia => {
              if(transferencia.ExpedienteOrigen.Identificador == this.modGenerales.Expediente.Identificador){
                esteExpediente = true;
              }
            });
      
            if(esteExpediente){
            localStorage.setItem('Transferencias', '1');
            
            this.router.navigate(['/EnviarTransferencias']);

            swal.fire({
              title: 'Transferencias',
              text: "Su transferencia aún no ha sido aceptada o rechazada",
              icon:'info'
            });
          }
        }
  
        });
     }


}
