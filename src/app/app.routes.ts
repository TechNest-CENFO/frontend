import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductsComponent } from './pages/products/products.component';
import { PrendasComponent } from './pages/prendas/prendas.component';

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
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin
          ],
          name: 'Tendencias',
          showInSidebar: true,
          icon: 'fa fa-line-chart'
        }
      },
      {
        path: 'colecciones',
        component: OrdersComponent,
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
        component: ProductsComponent,
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
        component: ProductsComponent,
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
        component: ProductsComponent,
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
        component: ProductsComponent,
        data: {
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Reportes',
          showInSidebar: true,
          icon: 'fa fa-database'
        }
      },
      {
        path: 'administrador',
        component: ProductsComponent,
        data: {
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
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
      }
    ],
  },
];
