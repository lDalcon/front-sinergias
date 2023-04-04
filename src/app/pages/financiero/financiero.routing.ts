import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreditosComponent } from './creditos/creditos.component';
import { ForwardComponent } from './forward/forward.component';
import { DiferenciaCambioComponent } from './diferencia-cambio/diferencia-cambio.component';
import { SolicitudComponent } from './solicitudes/solicitud.component';
import { SaldosdiarioComponent } from './saldosdiario/saldosdiario.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'obligaciones',
    },
    {
        path: 'obligaciones',
        component: CreditosComponent
    },
    {
        path: 'forward',
        component: ForwardComponent
    },
    {
        path: 'diferenciacambio',
        component: DiferenciaCambioComponent
    },
    {
        path: 'solicitudes',
        component: SolicitudComponent
    },
    {
        path: 'saldosdiario',
        component: SaldosdiarioComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancieroRoutingModule { }