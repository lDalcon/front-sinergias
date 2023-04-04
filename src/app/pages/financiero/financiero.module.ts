import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancieroRoutingModule } from './financiero.routing';
import { CreditosComponent } from './creditos/creditos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForwardComponent } from './forward/forward.component';
import { DiferenciaCambioComponent } from './diferencia-cambio/diferencia-cambio.component';
import { SolicitudComponent } from './solicitudes/solicitud.component';
import { SaldosdiarioComponent } from './saldosdiario/saldosdiario.component';

@NgModule({
  declarations: [
    CreditosComponent,
    ForwardComponent,
    DiferenciaCambioComponent,
    SolicitudComponent,
    SaldosdiarioComponent
  ],
  imports: [
    CommonModule,
    FinancieroRoutingModule,
    SharedModule
  ]
})
export class FinancieroModule { }
