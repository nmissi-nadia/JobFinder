import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Routes Publiques
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/job-list/job-list').then(m => m.JobListComponent)
  },
  {
    path: 'jobs/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/jobs/job-detail/job-detail').then(m => m.JobDetailComponent)
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  // Routes Protégées
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: 'login' }
];
