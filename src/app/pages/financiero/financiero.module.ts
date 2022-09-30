import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancieroRoutingModule } from './financiero.routing';
import { CreditosComponent } from './creditos/creditos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForwardComponent } from './forward/forward.component';
import { DiferenciaCambioComponent } from './diferencia-cambio/diferencia-cambio.component';

@NgModule({
  declarations: [
    CreditosComponent,
    ForwardComponent,
    DiferenciaCambioComponent
  ],
  imports: [
    CommonModule,
    FinancieroRoutingModule,
    SharedModule
  ]
})
export class FinancieroModule { }
