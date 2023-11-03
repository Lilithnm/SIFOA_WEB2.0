import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministraMaterialesComponent } from './administra-materiales/administra-materiales.component';
import { AdministraSolicitudesComponent } from './administra-solicitudes/administra-solicitudes.component';
import { AdministraPeriodosComponent } from './administra-periodos/administra-periodos.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'admin-materiales',
    component: AdministraMaterialesComponent,
  },
  {
    path: 'admin-solicitudes',
    component: AdministraSolicitudesComponent,
  },
  {
    path: 'admin-centros',
    component: AdministraPeriodosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
