import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './dashboard/main.component';
import { GeneralesComponent } from './generales/generales.component';
import { AnexosComponent } from './operacion/anexos/anexos.component';

const routes: Routes = [
  
  {
    path: 'dashboard',
    component: MainComponent,
  },
  {
    path: 'generales',
    component: GeneralesComponent,
  },
  {
    path: 'anexos',
    component: AnexosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
