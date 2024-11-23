import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { LoginComponent } from './components/auth/login/login.component';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'home',
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'edit-user/:id',
    component: CreateUserComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'list-users',
    component: ListUsersComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'user/profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
