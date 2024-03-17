import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MenuComponent } from './components/menu/menu.component';
import { PrimeNgModule } from './libs/prime-ng.module';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { CatalogoComponent } from './util/catalogo/catalogo.component';
import { RegionalComponent } from './util/regional/regional.component';
import { AmortizacionComponent } from './util/amortizacion/amortizacion.component';
import { CreditoComponent } from './util/credito/credito.component';
import { ListadoForwardComponent } from './util/listado-forward/listado-forward.component';
import { DetallePagoComponent } from './util/detalle-pago/detalle-pago.component';
import { ForwardComponent } from './util/forward/forward.component';
import { ListadoCreditoComponent } from './util/listado-credito/listado-credito.component';
import { CalendarioComponent } from './util/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EmpresaComponent } from './util/empresa/empresa.component';

@NgModule({
  declarations: [
    AmortizacionComponent,
    CalendarioComponent,
    CatalogoComponent,
    CreditoComponent,
    DetallePagoComponent,
    EmpresaComponent,
    ForwardComponent,
    LayoutComponent,
    ListadoCreditoComponent,
    ListadoForwardComponent,
    MenuComponent,
    MenuItemComponent,
    RegionalComponent,
    TopbarComponent,
  ],
  imports: [CommonModule, PrimeNgModule, FullCalendarModule],
  exports: [
    AmortizacionComponent,
    CalendarioComponent,
    CatalogoComponent,
    CreditoComponent,
    DetallePagoComponent,
    EmpresaComponent,
    ForwardComponent,
    FullCalendarModule,
    LayoutComponent,
    ListadoCreditoComponent,
    ListadoForwardComponent,
    MenuComponent,
    MenuItemComponent,
    PrimeNgModule,
    RegionalComponent,
    TopbarComponent,
  ],
})
export class SharedModule {}
