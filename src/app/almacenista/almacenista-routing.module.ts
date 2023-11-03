import { Page404Component } from './../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministraSolicitudesComponent } from './administra-solicitudes/administra-solicitudes.component';

  const routes: Routes = [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'admin-sol',
      component: AdministraSolicitudesComponent,
    },

    
    { path: '**', component: Page404Component },
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlmacenistaRoutingModule {}
