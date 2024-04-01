import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { HomeRedirect } from './HomeRedirect';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { UsersComponent } from './components/dashboard/users/users.component';
import { AddUserComponent } from './components/dashboard/add-user/add-user.component';
import { AuthRedirect } from './AuthRedirect';
import { AppComponent } from './app.component';
import { RoleManagementComponent } from './components/dashboard/role-management/role-management.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'app',
        component: HomeRedirect,
        children: [
          { path: '', component: DashboardComponent, title: 'Home' },
          { path: 'users', component: UsersComponent, title: 'List of Users' },
          { path: 'add-user', component: AddUserComponent, title: 'Add User' },
          {
            path: 'role-management',
            component: RoleManagementComponent,
            title: 'Manage Roles',
          },
        ],
      },
      {
        path: 'auth',
        component: AuthRedirect,
        children: [
          { path: 'login', component: LoginComponent, title: 'Login' },
          { path: 'signup', component: SignupComponent, title: 'Signup' },
          {
            path: 'forgot-password',
            component: ForgotPasswordComponent,
            title: 'Forgot Password',
          },
        ],
      },
    ],
  },
];
