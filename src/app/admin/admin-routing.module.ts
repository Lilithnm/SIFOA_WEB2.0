import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './dashboard/main.component';
import { GeneralesComponent } from './generales/generales.component';

const routes: Routes = [
  
  {
    path: 'dashboard',
    component: MainComponent,
  },
  {
    path: 'generales',
    component: GeneralesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
