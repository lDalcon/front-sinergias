import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreditosComponent } from './creditos/creditos.component';
import { ForwardComponent } from './forward/forward.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancieroRoutingModule { }