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
  {
    path: 'dashboard',
    loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
];