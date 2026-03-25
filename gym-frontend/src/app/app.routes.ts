import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ptGuard } from './guards/pt.guard';
import { adminGuard } from './guards/admin.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', 
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.page').then( m => m.ContactPage)
  },
  {
    path: 'dashboard-utente',
    canActivate: [AuthGuard],
    loadComponent: () => import('./dashboard-utente/dashboard-utente.page').then( m => m.DashboardUtentePage)
  },
  {
    path: 'utente-schedule',
    canActivate: [AuthGuard],
    loadComponent: () => import('./utente-schedule/utente-schedule.page').then( m => m.UtenteSchedulePage)
  },
  {
    path: 'utente-booking',
    canActivate: [AuthGuard],
    loadComponent: () => import('./utente-booking/utente-booking.page').then( m => m.UtenteBookingPage)
  },
  {
    path: 'utente-search',
    canActivate: [AuthGuard],
    loadComponent: () => import('./utente-search/utente-search.page').then( m => m.UtenteSearchPage)
  },
  {
    path: 'dashboard-pt',
    canActivate: [ptGuard],
    loadComponent: () => import('./dashboard-pt/dashboard-pt.page').then( m => m.DashboardPTPage)
  },
    {
    path: 'pt-schedule',
    canActivate: [ptGuard],
    loadComponent: () => import('./pt-schedule/pt-schedule.page').then( m => m.PtSchedulePage)
  },
  {
    path: 'pt-calendar',
    canActivate: [ptGuard],
    loadComponent: () => import('./pt-calendar/pt-calendar.page').then( m => m.PtCalendarPage)
  },
  {
    path: 'dashboard-admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./dashboard-admin/dashboard-admin.page').then( m => m.DashboardAdminPage)
  },
  {
    path: 'admin-list',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin-list/admin-list.page').then( m => m.AdminListPage)
  },
];
