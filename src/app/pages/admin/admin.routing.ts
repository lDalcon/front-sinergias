import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MacroeconomicosComponent } from './macroeconomicos/macroeconomicos.component';
import { CalendarioComponent } from './calendario/calendario.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'usuarios',
    },
    {
        path: 'usuarios',
        component: UsuariosComponent
    },
    {
        path: 'macroeconomicos',
        component: MacroeconomicosComponent
    },
    {
        path: 'calendario',
        component: CalendarioComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }