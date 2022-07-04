import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MacroeconomicosComponent } from './macroeconomicos/macroeconomicos.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }