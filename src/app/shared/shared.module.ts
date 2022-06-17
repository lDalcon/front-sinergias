import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MenuComponent } from './components/menu/menu.component';
import { PrimeNgModule } from './libs/prime-ng.module';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { CatalogoComponent } from './util/catalogo/catalogo.component';
import { RegionalComponent } from './util/regional/regional.component';



@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    MenuComponent,
    MenuItemComponent,
    CatalogoComponent,
    RegionalComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    LayoutComponent,
    TopbarComponent,
    MenuComponent,
    PrimeNgModule,
    MenuItemComponent,
    CatalogoComponent,
    RegionalComponent
  ]
})
export class SharedModule { }
