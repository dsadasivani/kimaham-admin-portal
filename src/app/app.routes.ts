import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

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
];
