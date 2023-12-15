import { Component, OnInit, Input,ViewChild, Inject, Optional  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomicilioComponent } from '../domicilio/domicilio.component';
import { Router } from '@angular/router';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';
import { DomicilioModel, GeneralesModel, PersonajeModel, TipoPersonajeModel } from 'src/models/generales';
import { GeneralesService } from 'src/services/sifoa/generales.service';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { PersonajesService } from 'src/services/sifoa/personajes.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-personajes',
  templateUrl: './personajes.component.html',
  styleUrls: ['./personajes.component.scss']
})
export class PersonajesComponent  implements OnInit {

  @Input() VaGuardar = false;
  beneficiariosLista:  PersonajeModel[]=[];

  @ViewChild('ciudad', {static: false}) ciudadInput!: MatInput;

  generales!: GeneralesModel;
  personaje: PersonajeModel = new PersonajeModel();
  personajeEdita: PersonajeModel = new PersonajeModel();
  desactivado= true;
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  diasVigencia :number = 2592000000; // formula dias(30) *24*60*60*1000

  domiciliosList: DomicilioModel[]=[]

  tiposPersonaje: TipoPersonajeModel[]=[];

    public form: FormGroup = Object.create(null);
    constructor( private fb: FormBuilder,  private svcGenerales: GeneralesService,
      @Optional() @Inject(MAT_DIALOG_DATA) public  data: PersonajeModel,
      private router: Router,
      public dialogRef: MatDialogRef<PersonajesComponent>,
      private svcCatalogos: CatalogoService, 
      private svcPersonaje: PersonajesService, 
      private dialog: MatDialog) {
        
      this.obtenerTipos()   

      if (localStorage.getItem('Generales')) {
        this.generales = JSON.parse(localStorage['Generales']);
      }
      this.form = this.fb.group({
        Nombre: [null, [Validators.required]],
        Paterno: [""],
        Materno: [""],
        TipoPersonaje:[null, [Validators.required]]
    });
    
    this.personajeEdita = data;
 
    }

  ngOnInit(): void {
        
  }

  agregar(){    
   

    if(this.form.valid)
    { 
      this.personaje = this.form.getRawValue();
      this.personaje.Domicilios = this.domiciliosList;
      this.personaje.IdExpediente = this.generales.Expediente.Identificador;
      if(this.domiciliosList?.length>=1){

        if(this.personajeEdita?.Identificador){
          
          this.personaje.Identificador = this.personajeEdita.Identificador;

          this.svcPersonaje.Actualizar(this.personaje).subscribe(response => {          
            swal.fire({
              title: 'Éxito',
              text: 'Personaje actualizado.',
              icon: 'success'
            });            
            //actualizar expedientee en el almacenamiento
            this.dialog.closeAll()
          
        }, errResponse => {
        }, () => {  
        });
        }else{
          this.svcPersonaje.Crear(this.personaje).subscribe(response => {          
              swal.fire({
                title: 'Éxito',
                text: 'Personaje agregado.',
                icon: 'success'
              });            
              //actualizar expedientee en el almacenamiento
              this.svcGenerales.ObtenerGenerales(this.generales.Expediente).pipe(takeUntil(this.destroy$)).
                subscribe(generales => {
                  localStorage.setItem('Generales', JSON.stringify(generales));
                  localStorage.setItem('IdExpediente', generales.Expediente.Identificador.toString());

                  location.reload()
              });
            
          }, errResponse => {     
          }, () => {
          });

        }    
        
      }else{
        this.dialog.open(ModalComponent, {
          width: '500px',
          data: {Title: 'Atención', Text: 'El personaje no tiene domicilios registrados'}
        });
      }

    }
    else{
      this.form.markAllAsTouched();
    }
 
  }
  agregarDomicilio(){
    const domicilio = new DomicilioModel();

    domicilio.IdPersonaje = this.personajeEdita?.Identificador;
    const dialogRef = this.dialog.open(DomicilioComponent, 
      {width: '80vw',
        maxWidth: '150vw',
        disableClose: true,
        data: domicilio
    });

    dialogRef.afterClosed().subscribe(() => {      
      if(dialogRef.componentInstance.guardar){

        let domicilio = dialogRef.componentInstance.domicilio;
          this.domiciliosList.push(dialogRef.componentInstance.domicilio);
      }      
     });  
  }
  editarDomicilio(domicilio: DomicilioModel){
    const dialogRef = this.dialog.open(DomicilioComponent, 
      {width: '80vw',
        maxWidth: '150vw',
        disableClose: true,
        data: domicilio
    });
    let domicilioCambia: DomicilioModel;

    dialogRef.afterClosed().subscribe(() => {      
      if(dialogRef.componentInstance.guardar){
        domicilioCambia = dialogRef.componentInstance.domicilio;
        domicilioCambia.Estatus = 2;
        var foundIndex = this.domiciliosList.findIndex(x => x.Identificador == domicilio.Identificador);
          this.domiciliosList[foundIndex] = domicilioCambia;
      }      
     });  
  }
  select(valor:any){
console.log(this.form.getRawValue())
  }
  eliminarDomicilio(domicilio: DomicilioModel){

    this.dialog
    .open(ModalConfirmComponent, {
      data: {Title: 'Eliminar', Text: '¿Está seguro de eliminar el domicilio?'}
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {

        if(domicilio.Identificador >0){
          this.svcPersonaje.EliminarDomicilio(domicilio).subscribe(response => {    
            console.log(response)    
            if(response){
              swal.fire({
                title: 'Éxito',
                text: 'Domicilio eliminado.',
                icon: 'success'
              });                          
  
            }  else{
              swal.fire({
                title: 'Error',
                text: 'El domicilio no se puede eliminar',
                icon: 'info'
              });  
            }
            })
        }else{
          swal.fire({
            title: 'Éxito',
            text: 'Domicilio eliminado.',
            icon: 'success'
          }); 

        }
        
          this.dialog.closeAll()
      } 
    });
    
    
  }


  cancelar(){   
   window.location.reload()
  }
  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.Identificador == object2.Identificador;
}
  obtenerTipos(){
    const body = '{"Identificador": 0}';
    this.svcCatalogos.ObtenerCatalogo(body, 7).subscribe(response => {
      if (response) {
        this.tiposPersonaje = response;
        this.tiposPersonaje = this.tiposPersonaje.filter(personaje => Number(personaje.Nombre.split("-")[1]) ==this.generales.Expediente.Sistema );
        this.personajeEdita = this.personajeEdita;
        if(this.personajeEdita!=null){
          this.form.patchValue(this.personajeEdita);
          this.form.controls['TipoPersonaje'].setValue(this.personajeEdita.TipoPersonaje);
          if(this.personajeEdita.Domicilios?.length >=1){            
            this.domiciliosList = this.personajeEdita.Domicilios;
          }else{
            
          this.domiciliosList = [];
          }
        }
  
  
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

