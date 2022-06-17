import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { PrimeNgModule } from './shared/libs/prime-ng.module';
import { ConfigService } from './shared/services/util/app.config.service';
import { MenuService } from './shared/services/util/app.menu.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfigService,
    MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
