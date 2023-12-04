import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AutenticacionService } from 'src/services/shared/autenticacion.service';
import { Rol } from 'src/models/modelos';
@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss'],
})
export class LockedComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  userImg!: string;
  userFullName!: string;
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AutenticacionService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
   // this.userImg = this.authService.currentUserValue.img;
    this.userFullName =
      this.authService.currentUserValue.Nombre
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      const role = this.authService.currentUserValue.Rol;
      if (role === Rol.Administrador) {
        this.router.navigate(['/admin/dashboard/main']);
      } else if (role === Rol.Juez) {
        this.router.navigate(['/coordinador/dashboard']);
      } else if (role === Rol.Secretario) {
        this.router.navigate(['/solicitante/dashboard']);
      } else {
        this.router.navigate(['/authentication/signin']);
      }
    }
  }
}
