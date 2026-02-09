import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  { path:'',redirectTo:'login',pathMatch: 'full'},
  // Route Publique : Jobs
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/job-list/job-list.component').then(m => m.JobListComponent)
  },
  //Routes Auth
  {
      path: 'login',
      loadComponent: () => import('./features/auth/login/login.component').then(m =>m.LoginComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/register/register.component').then(m =>m.RegisterComponent)
  },
  { path: '**', redirectTo: 'login' }
];
