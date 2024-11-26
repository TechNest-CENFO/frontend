import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import {PasswordRecoveryComponent} from "./pages/auth/password-recovery/password-recovery.component";
import {PasswordResetComponent} from "./pages/auth/password-reset/password-reset.component";
import { PrendasComponent } from './pages/prendas/prendas.component';
import {OutfitsComponent} from "./pages/outfits/outfits.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import { CollectionsComponent } from './pages/collections/collections.component';
import { LoansComponent } from './pages/loans/loans.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'passwordRecovery',
    component: PasswordRecoveryComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'password-reset/:token',
    component: PasswordResetComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Dashboard',
          showInSidebar: true,
          icon: 'fa fa-home'
        }
      },
      {
        path: 'tendencias',
        component: OutfitsComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Tendencias',
          showInSidebar: true,
          icon: 'fa fa-line-chart'
        }
      },
      {
        path: 'colecciones',
        component: CollectionsComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Colecciones',
          showInSidebar: true,
          icon: 'fa fa-object-group'
        }
      },
      {
        path: 'outfits',
        component: OutfitsComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Outfits',
          showInSidebar: true,
          icon: 'fa fa-camera'
        }
      },
      {
        path: 'prendas',
        component: PrendasComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Prendas',
          showInSidebar: true,
          icon: 'fa fa-camera'
        }
      },
      {
        path: 'recomendaciones',
        component: OutfitsComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Recomendaciones',
          showInSidebar: true,
          icon: 'fa fa-lightbulb'
        }
      },
      {
        path: 'prestamos',
        component: LoansComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Préstamos',
          showInSidebar: true,
          icon: 'fa fa-handshake'
        }
      },
      {
        path: 'reportes',
        component: OutfitsComponent,
        data: {
          authorities: [
            IRoleType.admin, 
          ],
          name: 'Reportes',
          showInSidebar: true,
          icon: 'fa fa-database'
        }
      },
      {
        path: 'administrador',
        component: OutfitsComponent,
        data: {
          authorities: [ 
            IRoleType.admin,
          ],
          name: 'Administrador',
          showInSidebar: true,
          icon: 'fa fa-cogs'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'profile',
          showInSidebar: false
        }
      },
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
