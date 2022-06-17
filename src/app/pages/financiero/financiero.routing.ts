import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreditosComponent } from './creditos/creditos.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'creditos',
    },
    {
        path: 'creditos',
        component: CreditosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancieroRoutingModule { }