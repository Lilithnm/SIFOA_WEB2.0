import { Component, OnInit, Input,ViewChild, Inject, Optional  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs/internal/Subject';
import { BeneficiarioModel } from 'src/models/main';
import { GeneralesModel, PersonajeModel } from 'src/models/generales';
import { BeneficiarioMinModel } from 'src/models/modelos';
import { CatalogoService } from 'src/services/shared/catalogo.service';
import { GeneralesService } from 'src/services/sifoa/generales.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.scss']
})
export class BeneficiariosComponent  implements OnInit {

  @Input() VaGuardar = false;
  beneficiariosLista:  BeneficiarioModel[]=[];

  @ViewChild('ciudad', {static: false}) ciudadInput!: MatInput;

  personajes: PersonajeModel[] = [];
  benefBusqueda: BeneficiarioModel= new BeneficiarioModel();
  generales!: GeneralesModel;
  numeroEmpleado: number=0;

  desactivado= true;
  busco= false;
  listaCoincidencias: BeneficiarioMinModel[]=[];
  listaCoincidenciasTemp: BeneficiarioMinModel[]=[];
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  empleados: BeneficiarioMinModel[]=[];
  diasVigencia :number = 2592000000; // formula dias(30) *24*60*60*1000

    public form: FormGroup = Object.create(null);
    constructor( private fb: FormBuilder, private svcSpinner: NgxSpinnerService, private svcGenerales: GeneralesService,
      
      @Optional() @Inject(MAT_DIALOG_DATA) public data:BeneficiarioModel[],
      private svcCatalogos: CatalogoService,
      private dialog: MatDialog, private dialogRef: MatDialogRef<BeneficiariosComponent>) {

        this.beneficiariosLista = data;

      if (localStorage.getItem('Generales')) {
        this.generales = JSON.parse(localStorage['Generales']);
        this.personajes = this.generales.Personajes;
      }
    }

  ngOnInit(): void {
    this.form = this.fb.group({
      Personaje: this.fb.group({
        Nombre: ["", [Validators.required]],
        Paterno: ["", [Validators.required]],
        Materno: [""]
      }),
      NombreEmpleado: [null],
      TipoIdentificacion: [{value: '', disabled: this.desactivado}, [Validators.required]],
      Vigencia : [{value: '', disabled: this.desactivado}, [Validators.required]],
      NumeroIdentificacion: [{value: '', disabled: this.desactivado}, [Validators.required]],
    });
  }
  getEstatus(estatus:any){
    if(estatus)
      return "(ACTIVO)"
    else
      return "(INACTIVO)"
  }
  buscaEmpleado(){
    
    this.svcSpinner.show();
    this.busco=true;
    this.benefBusqueda = this.form.getRawValue();

    if(this.benefBusqueda.Personaje.Nombre!=""&& this.benefBusqueda.Personaje.Nombre!=null){
    this.svcGenerales.buscaBeneficiario(this.benefBusqueda.Personaje.Nombre+" "+this.benefBusqueda.Personaje.Paterno+" "+this.benefBusqueda.Personaje.Materno).pipe(takeUntil(this.destroy$)).subscribe(resultado => {
      if(resultado.length>0)
       { //this.empleados = resultado
        this.listaCoincidencias = resultado;
        this.listaCoincidenciasTemp = resultado;
          ////concatenar el estatus en el nombre
        this.empleados = resultado.map(current => {
          let data = new BeneficiarioMinModel();
          data = current;
          data.NombreCompleto = current.NombreCompleto+" "+this.getEstatus(current.Estatus)
          return data;
        }); // [...this.arrAnexos];

        this.form.controls['NombreEmpleado'].setValidators([Validators.required]);
        this.dialog.open(ModalComponent, {
          width: '400px',
          data: {Title: 'Éxito', Text: 'Se encontraron coincidencias, seleccione.'}
        });
        }
      else
        {
          this.listaCoincidencias.push({NombreCompleto:'Otro (No es empleado)'+
                                        this.benefBusqueda.Personaje.Nombre+' '+ 
                                        this.benefBusqueda.Personaje.Paterno+' '+
                                        this.benefBusqueda.Personaje.Materno,Estatus:'true'});
          this.empleados = []
          this.dialog.open(ModalComponent, {
            width: '400px',
            data: {Title: 'Info', Text: 'No hubieron coincidencias'}
          });
        }
        this.svcSpinner.hide();
      });
      
      this.form.controls['TipoIdentificacion'].enable();   
      this.form.controls['Vigencia'].enable();    
      this.form.controls['NumeroIdentificacion'].enable();
        
   
    }else{
      this.dialog.open(ModalComponent, {
        width: '400px',
        data: {Title: 'Error', Text: 'Debe escribir un nombre'}
      });
      this.svcSpinner.hide();
    }
    
  }
  empleadoSel(seleccionado: any){
    this.listaCoincidencias = this.listaCoincidenciasTemp
   var splitted = seleccionado.NombreCompleto.split("|",2)
   this.numeroEmpleado = Number(splitted[0].trim());
   /////cuando se selecciona un empleado, guardarlo con el estatus en true en las coincidenciass
    this.listaCoincidencias.map(current => {
      if(current.NombreCompleto == seleccionado.NombreCompleto)
        current.Estatus = 'true'
      else
      current.Estatus = 'false'      
      
    }); 
    console.log(this.listaCoincidencias)

  }

  noEmpleado(){
    this.listaCoincidencias = this.listaCoincidenciasTemp
    this.empleados=[];
    this.numeroEmpleado = 0;    
    this.form.controls['NombreEmpleado'].setErrors(null) ;
    this.form.controls['NombreEmpleado'].clearValidators()
    
    let noemp = <BeneficiarioModel>this.form.getRawValue(); 

    this.listaCoincidencias.map(current => {
      current.Estatus = 'false'      
    }); 
    
    this.listaCoincidencias.push({NombreCompleto:'Otro (No es empleado)'+noemp.Personaje.Nombre+' '+ noemp.Personaje.Paterno+' '+noemp.Personaje.Materno,Estatus:'true'});

  }

  agregar(){
    if(this.busco){
      if(this.form.valid)
      {
        let BeneficiarioF: BeneficiarioModel =new BeneficiarioModel();   

        BeneficiarioF = <BeneficiarioModel>this.form.getRawValue(); 
        
        BeneficiarioF.NoEmpleado = this.numeroEmpleado;
        BeneficiarioF.Estatus =1;


          if(!this.beneficiariosLista) {
              this.beneficiariosLista = [];
          }else{
              this.beneficiariosLista.push(BeneficiarioF);
                          
          }
          
        this.dialogRef.close();
      } 
      else {
        this.form.markAllAsTouched();
        this.dialog.open(ModalComponent, {
          width: '400px',
          data: {Title: 'Advertencia', Text: 'Llene todos los campos'}
        });
      }
    }else{
        this.dialog.open(ModalComponent, {
          width: '400px',
          data: {Title: 'Advertencia', Text: 'Debe buscar el nombre'}
        });
    }
  
  }

  cancelar(){
    this.dialogRef.close();
  }

}

