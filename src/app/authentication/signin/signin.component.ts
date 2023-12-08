import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
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
import { Rol, TicketModel, UsuarioMinModel, UsuarioModel } from 'src/models/modelos';
import { CentrosService } from 'src/services/sifoa/centros.service';
import { Server, ServerPruebas } from 'src/environments/global';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  
  @ViewChild('test') private testSwal!: SwalComponent;
  
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  Tickets!: TicketModel[];
  esAdmin = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svcAuth: AutenticacionService,
    private svcCentros: CentrosService,
    private fnFunctions: Functions
  ) {
    super();
    
    localStorage.clear();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  inicializarUsuario(): UsuarioMinModel {
    const modUser = new UsuarioMinModel(
      '',
      this.fnFunctions.encrypt(this.authForm.value.username),
      this.fnFunctions.encryptMd5Encrypt(this.authForm.value.password)
    );
    return modUser;
  }

  responseLogin(response: UsuarioModel): void {
    if (response != null) {
      //const ticketJson = response.Tickets;

      this.Tickets =response.Tickets;
     if(this.Tickets == null){
        Swal.fire({
          text: 'Usted no tiene acceso a ningún sistema',
          icon: 'info'
        });
     }
        // this.router.navigate(['/admin/dashboard/main']);
      this.ticketResult()
    }
    else {
      Swal.fire({
        text: 'Credenciales Incorrectas.',
        icon: 'error'
      });
    }
  }


  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Nombre de usuario y ocntraseña inválidos';
      return;
    } else {
      this.svcAuth.Login(this.inicializarUsuario()).subscribe({
        next: (res) => {
          if (res) {
              this.responseLogin(res);
          } else {
            this.error = 'Invalid Login';
          }
        },
        error: (error) => {
          this.loading = false;
        },
      });
      
  
    }
  }
  
  ticketResult(): void {
    if (this.Tickets.length !== 0) {
      if (this.Tickets.length > 1) {
        this.testSwal.fire();
      } else {
        this.centroSeleccionado(this.Tickets[0]);
      }
    } else {
      Swal.fire({
        text: 'No tiene acceso a ningun sistema, contacte a soporte.',
        icon: 'error'
      });
    }
  }


  centroSeleccionado(ticket: TicketModel): void {

        let oficina = ticket.Oficina;        
        this.testSwal.close()
        this.svcAuth.asignaToken(ticket);
        console.log(ticket)
        
        if(oficina.Produccion==1){
          localStorage.setItem('Server',Server);
          localStorage.setItem('Ambiente','Productivo');
        }else{
          localStorage.setItem('Server',ServerPruebas);
          localStorage.setItem('Ambiente','Pruebas');
        }


     //   if(ticket.Plataforma.Identificador == 1){
          localStorage.setItem('Oficina',oficina.Nombre.toString());
          localStorage.setItem('Centro', oficina.Identificador.toString());
          const role = this.svcAuth.currentUserValue.Rol;


          console.log(this.svcAuth.currentUserValue)
          if (role == Rol.Administrador ) {
            this.router.navigate(['/admin/dashboard']);
          }/* else if (role == Rol.Coordinador) {
            this.router.navigate(['/coordinador/dashboard']);
          } else if (role == Rol.Solicitante ) {
            this.router.navigate(['/solicitante/dashboard']);
          } else if (role == Rol.Capturista) {
            this.router.navigate(['/capturista/dashboard']);
          } else if (role == Rol.Almacenista) {
            this.router.navigate(['/almacenista/dashboard']);
          } else {
            this.router.navigate(['/authentication/signin']);
          }  */
     /*   }
        else{        
          localStorage.setItem("session", JSON.stringify(this.svcAuth.currentUserValue));
          console.log(ticket)
          console.log(this.svcAuth.currentUserValue.Token)   
          let usr =((this.fnFunctions.Encrypt(this.svcAuth.currentUserValue.Identificador)).replace('/','').replace('=','').replace('=',''))
          console.log(usr)
          window.location.href = (ticket.Plataforma.Descripcion).replace(':id',usr);
        }
*/



  }

}