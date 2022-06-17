import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('../../pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'financiero',
    loadChildren: () => import('../../pages/financiero/financiero.module').then(m => m.FinancieroModule)
  },
//   {
//     path: 'reportes',
//     canActivate: [AuthGuard],
//     loadChildren: () => import('../../pages/reportes/reportes.module').then(m => m.ReportesModule)
//   },
//   {
//     path: 'procesos',
//     canActivate: [AuthGuard],
//     loadChildren: () => import('../../pages/procesos/procesos.module').then(m => m.ProcesosModule)
//   }
];