import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashFinancieroComponent } from './dash-financiero/dash-financiero.component';
import { DashGerenciaComponent } from './dash-gerencia/dash-gerencia.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'financiero',
    },
    {
        path: 'financiero',
        component: DashFinancieroComponent
    },
    {
        path: 'gerencia',
        component: DashGerenciaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }