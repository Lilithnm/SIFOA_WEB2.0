import { Page404Component } from './../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolicitudesTablaComponent } from './solicitud/solicitudes-tabla.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';
import { AdministraSolicitudesComponent } from './administra-solicitudes/administra-solicitudes.component';
import { AdministraPeriodosComponent } from './administra-periodos/administra-periodos.component';
import { SolicitudesHistorialComponent } from './solicitudes-historial/solicitudes-historial.component';

  const routes: Routes = [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'solicitudes',
      component: SolicitudesTablaComponent,
    },
    {
      path: 'nueva-solicitud',
      component: NuevaSolicitudComponent,
    },

    {
      path: 'admin-sol',
      component: AdministraSolicitudesComponent,
    },
    
    {
      path: 'sol-hist',
      component: SolicitudesHistorialComponent,
    },

    {
      path: 'admin-per',
      component: AdministraPeriodosComponent,
    },
    
    { path: '**', component: Page404Component },
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordinadorRoutingModule {}
