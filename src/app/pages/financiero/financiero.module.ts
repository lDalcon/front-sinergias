import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancieroRoutingModule } from './financiero.routing';
import { CreditosComponent } from './creditos/creditos.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CreditosComponent
  ],
  imports: [
    CommonModule,
    FinancieroRoutingModule,
    SharedModule
  ]
})
export class FinancieroModule { }
