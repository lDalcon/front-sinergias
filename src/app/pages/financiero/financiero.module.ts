import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancieroRoutingModule } from './financiero.routing';
import { CreditosComponent } from './creditos/creditos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForwardComponent } from './forward/forward.component';

@NgModule({
  declarations: [
    CreditosComponent,
    ForwardComponent
  ],
  imports: [
    CommonModule,
    FinancieroRoutingModule,
    SharedModule
  ]
})
export class FinancieroModule { }
