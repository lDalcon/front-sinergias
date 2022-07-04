import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashGerenciaComponent } from './dash-gerencia/dash-gerencia.component';
import { DashFinancieroComponent } from './dash-financiero/dash-financiero.component';
import { DashboardRoutingModule } from './dashboard.routes';



@NgModule({
  declarations: [
    DashGerenciaComponent,
    DashFinancieroComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
