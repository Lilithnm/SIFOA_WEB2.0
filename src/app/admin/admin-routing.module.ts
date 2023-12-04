import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },/* 
  {
    path: 'admin-materiales',
  },
  {
    path: 'admin-solicitudes',
    component: AdministraSolicitudesComponent,
  },
  {
    path: 'admin-centros',
    component: AdministraPeriodosComponent,
  }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
