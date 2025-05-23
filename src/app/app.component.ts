import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z5">
      <img
        class="logo-img"
        src="assets/images/logo.png"
        title="KIMAHAM - Admin Portal"
        routerLink="/"
      />
      <button
        mat-button
        *ngIf="currentUser(); else guest_button"
        [mat-menu-trigger-for]="userMenu"
      >
        {{ currentUser()?.displayName }}
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <ng-template #guest_button>
        <button mat-button [mat-menu-trigger-for]="userMenu">
          Guest
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
      </ng-template>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item routerLink="/home">
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button *ngIf="!currentUser()" mat-menu-item routerLink="/login">
          <mat-icon>login</mat-icon>
          Login
        </button>
        <button *ngIf="currentUser()" mat-menu-item routerLink="/user/profile">
          <mat-icon>account_circle</mat-icon>
          My Profile
        </button>
        <div *ngIf="currentUser()" style="margin: 0px 10px">
          <mat-divider></mat-divider>
        </div>
        <button *ngIf="currentUser()" mat-menu-item routerLink="/list-users">
          <mat-icon>groups</mat-icon>
          List Candidates
        </button>
        <button *ngIf="currentUser()" mat-menu-item routerLink="/create-user">
          <mat-icon>person_add</mat-icon>
          Add Candidate
        </button>
        <div *ngIf="currentUser()" style="margin: 0px 10px">
          <mat-divider></mat-divider>
        </div>
        <button *ngIf="currentUser()" mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          logout
        </button>
      </mat-menu>
    </mat-toolbar>
    <div class="container">
      <span *ngIf="checkEnv()" class="env-label">Dev Environment</span>
      <router-outlet />
    </div>
    <ng-container *ngIf="loading()">
      <div class="overlay"></div>
      <mat-progress-spinner
        class="mat-spinner-color"
        *ngIf="loading()"
        mode="indeterminate"
      >
      </mat-progress-spinner>
    </ng-container>
  `,
  styles: [
    `
      mat-toolbar {
        font-weight: lighter;
        justify-content: space-between;
        position: sticky;
        top: 0px;
        z-index: 10000;
      }
      .logo-img {
        margin: 1vh;
        width: 2em;
        cursor: pointer;
      }
      mat-progress-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
      }
      .mat-spinner-color::ng-deep circle {
        stroke: #7c1316 !important;
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        backdrop-filter: blur(3px);
      }
      .env-label {
        background: #7c1316;
        padding: 4px 20px 4px 4px;
        border-radius: 0em 0em 2em 0em;
        color: white;
        font-weight: 500;
      }
    `,
  ],
})
export class AppComponent {
  checkEnv(): boolean {
    return !environment.production;
  }
  title = 'kimaham-admin-portal';
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  userService = inject(UsersService);
  router = inject(Router);
  loading = this.notificationService.loading;
  currentUser = this.userService.currentUserProfile;
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
