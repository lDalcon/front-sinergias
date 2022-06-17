import { AuthRoutingModule } from './auth.routing';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
/*Components*/
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
