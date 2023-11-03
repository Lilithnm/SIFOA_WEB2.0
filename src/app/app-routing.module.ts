import { Page404Component } from './authentication/page404/page404.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { Rol } from 'src/models/catalogos';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: {
          role: Rol.Admin,
        },
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'coordinador',
        canActivate: [AuthGuard],
        data: {
          role: Rol.Coordinador,
        },
        loadChildren: () =>
          import('./coordinador/coordinador.module').then((m) => m.CoordinadorModule),
      },
      {
        path: 'almacenista',
        canActivate: [AuthGuard],
        data: {
          role: Rol.Almacenista,
        },
        loadChildren: () =>
          import('./almacenista/almacenista.module').then((m) => m.AlmacenistaModule),
      },
      {
        path: 'solicitante',
        canActivate: [AuthGuard],
        data: {
          role: Rol.Solicitante,
        },
        loadChildren: () =>
          import('./solicitante/solicitante.module').then((m) => m.SolicitanteModule),
      },

      {
        path: 'capturista',
        canActivate: [AuthGuard],
        data: {
          role: Rol.Capturista,
        },
        loadChildren: () =>
          import('./capturista/capturista.module').then((m) => m.CapturistaModule),
      },

      // Extra components
      {
        path: 'extra-pages',
        loadChildren: () =>
          import('./extra-pages/extra-pages.module').then(
            (m) => m.ExtraPagesModule
          ),
      },
      {
        path: 'multilevel',
        loadChildren: () =>
          import('./multilevel/multilevel.module').then(
            (m) => m.MultilevelModule
          ),
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: '**', component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
