import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { AutenticacionService } from 'src/services/shared/autenticacion.service';
import Swal from 'sweetalert2';
import { Functions } from 'src/tools/functions';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { tick } from '@angular/core/testing';
import { Subject, takeUntil } from 'rxjs';
import { TicketModel, UsuarioMinModel, UsuarioModel } from 'src/models/modelos';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralesService } from 'src/services/sifoa/generales.service';
import { Server } from 'angular-feather/icons';
import { ServerPruebas } from 'src/environments/global';
import { CentrosModel } from 'src/models/catalogos';
import { ExpedienteBaseModel, GeneralesModel } from 'src/models/generales';
import { CentrosService } from 'src/services/sifoa/centros.service';
@Component({
  selector: 'app-login-interaccion',
  templateUrl: './login-interaccion.component.html',
  styleUrls: ['./login-interaccion.component.scss'],
})
export class LoginInteraccionComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  
  @ViewChild('test') private testSwal!: SwalComponent;
  destroy$: Subject<boolean> = new Subject<boolean>();
  date!: string;
  Id!: string;
  Expe!: string;
  Sistema!: string;
  Tickets!: TicketModel[];

  
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  esAdmin = false;

  public form: FormGroup = Object.create(null);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private svcAuth: AutenticacionService,
    private svcSpinner: NgxSpinnerService,
    private svcCentros: CentrosService,
    private svcGenerales: GeneralesService,
    private fnFunctions: Functions) {

    super();
    localStorage.clear();
    this.date = new Date().getFullYear().toString();
    this.activatedRoute.params.subscribe(({ Id, expe, sistema }) => {
      this.Id = Id;
      this.Expe = expe;
      this.Sistema = sistema;
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: [null, Validators.compose([Validators.required])]
    });

 
  }

  onSubmit(): void {
    this.svcSpinner.show();
    this.svcAuth.Login(this.inicializarUsuario()).subscribe(s => {
      this.responseLogin(s);
    }, err => {
    }, () => {
      this.svcSpinner.hide();
    });
  }

  inicializarUsuario(): UsuarioMinModel {

    console.log(this.Id)
    const modUser = new UsuarioMinModel(
      this.fnFunctions.decrypt64Encrypt(this.Id),
      '',
      this.fnFunctions.encryptMd5Encrypt(this.form.value.password)
    );
    return modUser;
  }

  responseLogin(response: any): void {
    if (response != null) {
      const ticketJson = localStorage.getItem('Ti');
      console.log(ticketJson)
      this.Tickets = ticketJson ? JSON.parse(ticketJson) : [];
      this.ticketResult();
    }
  }

  ticketResult(): void {
    if (this.Tickets.length !== 0) {
      if (this.Tickets.length > 1) {
        this.testSwal.fire();
      } else {
        this.centroSeleccionado(this.Tickets[0].Oficina.Identificador);
      }
    } else {
      Swal.fire({
        text: 'No tiene acceso a ningun sistema, contacte a Fondo Auxiliar.',
        icon: 'error'
      });
    }
  }


  centroSeleccionado(id: number): void {
    this.testSwal.close();
    this.svcSpinner.show();    

    this.svcCentros.buscarCentro(new CentrosModel(id)).subscribe(centro => {
      if (centro) {

        if(centro.Produccion==1){
          localStorage.setItem('Server',Server);
          localStorage.setItem('Ambiente','Productivo');
        }else{
          localStorage.setItem('Server',ServerPruebas);
          localStorage.setItem('Ambiente','Pruebas');
        }
                
        const Oficina = this.Tickets.find(({ Oficina }) => Oficina.Identificador === id);

        localStorage.setItem('Oficina',Oficina? Oficina.Oficina.Nombre:'');

        this.ObtenerValidarExpediente(this.armarBusqueda(centro));


      }else{
        Swal.fire({
          text: 'No se encuentra el centro de trabajo.',
          icon: 'info'
        });
      }
    }, () => { }, () => {
    });
  }

  armarBusqueda(Centro: CentrosModel): ExpedienteBaseModel {
    const busquedaExpediente = new ExpedienteBaseModel();
    if((+atob(this.fnFunctions.verficarLargo(this.Sistema))) == 17){
       var require: any
      const bigintConversion = require('bigint-conversion')

      busquedaExpediente.Centro = Centro;
      busquedaExpediente.IdentificadorOrigen = bigintConversion.bigintToText(bigintConversion.base64ToBigint(this.fnFunctions.verficarLargo(this.Expe)))
      busquedaExpediente.IdentificadorOrigenString =  bigintConversion.bigintToText(bigintConversion.base64ToBigint(this.fnFunctions.verficarLargo(this.Expe)))
      busquedaExpediente.Sistema = +atob(this.fnFunctions.verficarLargo(this.Sistema));


    }else{      
      busquedaExpediente.IdentificadorOrigen = +atob(this.fnFunctions.verficarLargo(this.Expe));
      busquedaExpediente.Centro = Centro;
      busquedaExpediente.Sistema = +atob(this.fnFunctions.verficarLargo(this.Sistema));
    }
    
    console.log(busquedaExpediente)

    return busquedaExpediente;
  }

  ObtenerValidarExpediente(busquedaExpediente: ExpedienteBaseModel): void {

    this.svcGenerales.ObtenerValidar(busquedaExpediente).subscribe(generalesExpediente => {
      if (generalesExpediente) {
        generalesExpediente.Expediente.Centro = busquedaExpediente.Centro;
        this.crearActualizarExpediente(generalesExpediente);
      }
    }, () => {Swal.fire({
      text: 'Verifique, no se encuentra el expediente',
      icon: 'info'
    });
    this.svcSpinner.hide(); }, () => {
      
      
    });
  }

  crearActualizarExpediente(generales: GeneralesModel): void {
    if (generales.Estatus === 1) {
      this.svcSpinner.show();
      this.svcGenerales.CrearGenerales(generales).pipe(takeUntil(this.destroy$)).subscribe(idExpediente => {
        if (idExpediente > 0) {
          
          this.svcSpinner.hide();
          localStorage.setItem('IdExpediente', idExpediente.toString());
          localStorage.setItem('Interaccion', '1');
          this.router.navigate(['/Generales']);
        }
      }, () => { }, () => {
        this.svcSpinner.hide();
      });
    } else if (generales.Estatus === 2) {

    } else {
      this.svcGenerales.ObtenerGenerales(generales.Expediente).pipe(takeUntil(this.destroy$)).
      subscribe(generales => {
          localStorage.setItem('Generales', JSON.stringify(generales));
          localStorage.setItem('IdExpediente', generales.Expediente.Identificador.toString());
          localStorage.setItem('Interaccion', '1');
          this.router.navigate(['/Generales']);
      });
  
    }
  }

    crearObjetoBusqueda(idExpediente: number, Centro: CentrosModel): ExpedienteBaseModel {
      const IdExpediente = idExpediente;
      const expedienteBusqueda = new ExpedienteBaseModel();
      expedienteBusqueda.Identificador = IdExpediente ? +IdExpediente : 0;
      expedienteBusqueda.Centro = Centro;
      expedienteBusqueda.Sistema = +atob(this.fnFunctions.verficarLargo(this.Sistema));
      return expedienteBusqueda;
    }


  }