import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { SignInComponent } from './components/user/sign-in/sign-in.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { ProfileComponent } from './components/user/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
  },
  {
    path: 'list-users',
    component: ListUsersComponent,
  },
  {
    path: 'user/sign-in',
    component: SignInComponent,
  },
  {
    path: 'user/sign-up',
    component: SignUpComponent,
  },
  {
    path: 'user/profile',
    component: ProfileComponent,
  },
];
