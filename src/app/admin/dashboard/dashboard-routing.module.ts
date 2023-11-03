import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent as SolicitanteDashboard } from 'src/app//solicitante/dashboard/dashboard.component';
import { DashboardComponent } from 'src/app/coordinador/dashboard/dashboard.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'coordinador-dashboard',
    component: DashboardComponent,
  },
  {
    path: 'solicitante-dashboard',
    component: SolicitanteDashboard,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
