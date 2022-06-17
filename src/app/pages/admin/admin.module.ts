import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AdminModule { }
