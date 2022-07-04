import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MacroeconomicosComponent } from './macroeconomicos/macroeconomicos.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    MacroeconomicosComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AdminModule { }
