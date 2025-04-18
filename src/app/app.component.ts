import { Component, HostListener, inject, signal } from '@angular/core';
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
import { animate, style, transition, trigger } from '@angular/animations';

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
  ],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    <div class="app-container" @fadeAnimation>
      <mat-toolbar
        color="primary"
        class="mat-elevation-z5"
        [class.scrolled]="isScrolled"
      >
        <div class="toolbar-container">
          <div class="logo-container">
            <img
              class="logo-img"
              src="assets/images/logo.png"
              title="KIMAHAM - Admin Portal"
              routerLink="/"
              alt="KIMAHAM Logo"
            />
            <span class="app-title" routerLink="/">KIMAHAM</span>
          </div>

          <div class="menu-container">
            <button mat-button routerLink="/home" class="nav-link">
              <mat-icon>home</mat-icon>
              <span class="nav-text">Home</span>
            </button>

            @if (currentUser()) {
            <button mat-button routerLink="/list-users" class="nav-link">
              <mat-icon>groups</mat-icon>
              <span class="nav-text">Candidates</span>
            </button>

            <button mat-button routerLink="/create-user" class="nav-link">
              <mat-icon>person_add</mat-icon>
              <span class="nav-text">Add Candidate</span>
            </button>
            }

            <button
              mat-button
              *ngIf="currentUser(); else guest_button"
              [mat-menu-trigger-for]="userMenu"
              class="user-menu-button"
            >
              <div class="avatar">{{ getUserInitials() }}</div>
              <span class="user-name">{{ currentUser()?.displayName }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>

            <ng-template #guest_button>
              <button mat-button routerLink="/login" class="login-button">
                <mat-icon>login</mat-icon>
                <span>Login</span>
              </button>
            </ng-template>

            <button
              mat-icon-button
              class="mobile-menu-button"
              [mat-menu-trigger-for]="mobileMenu"
            >
              <mat-icon>menu</mat-icon>
            </button>
          </div>
        </div>
      </mat-toolbar>

      <mat-menu #userMenu="matMenu" class="user-dropdown">
        <div class="user-info" *ngIf="currentUser()">
          <div class="avatar large">{{ getUserInitials() }}</div>
          <div class="user-details">
            <span class="user-display-name">{{
              currentUser()?.displayName
            }}</span>
            <span class="user-email">{{ currentUser()?.email }}</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <button mat-menu-item routerLink="/user/profile">
          <mat-icon>account_circle</mat-icon>
          <span>My Profile</span>
        </button>

        <mat-divider></mat-divider>

        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>

      <mat-menu #mobileMenu="matMenu">
        <button mat-menu-item routerLink="/home">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </button>

        @if (!currentUser()) {
        <button mat-menu-item routerLink="/login">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </button>
        } @else {
        <button mat-menu-item routerLink="/user/profile">
          <mat-icon>account_circle</mat-icon>
          <span>My Profile</span>
        </button>

        <button mat-menu-item routerLink="/list-users">
          <mat-icon>groups</mat-icon>
          <span>List Candidates</span>
        </button>

        <button mat-menu-item routerLink="/create-user">
          <mat-icon>person_add</mat-icon>
          <span>Add Candidate</span>
        </button>

        <mat-divider></mat-divider>

        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
        }
      </mat-menu>

      <div class="content-container">
        <div *ngIf="checkEnv()" class="env-label">Dev Environment</div>
        <div class="router-container">
          <router-outlet />
        </div>
      </div>

      <ng-container *ngIf="loading()">
        <div class="overlay"></div>
        <mat-progress-spinner class="mat-spinner-color" mode="indeterminate">
        </mat-progress-spinner>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      mat-toolbar {
        font-weight: 400;
        position: sticky;
        top: 0;
        z-index: 10000;
        transition: all 0.3s ease;
        padding: 0;
        height: auto;
        min-height: 64px;
        width: 100%;
      }

      .toolbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
        height: 100%;
        min-height: 64px;
        box-sizing: border-box;
      }

      .logo-container {
        display: flex;
        align-items: center;
        height: 100%;
        min-height: 64px;
        flex-shrink: 0;
      }

      .logo-img {
        height: 40px;
        width: auto;
        margin-right: 12px;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .logo-img:hover {
        transform: scale(1.05);
      }

      .app-title {
        font-size: 1.2rem;
        font-weight: 500;
        letter-spacing: 1px;
        cursor: pointer;
      }

      .menu-container {
        display: flex;
        align-items: center;
        height: 100%;
        min-height: 64px;
        gap: 8px;
        flex-shrink: 0;
        margin-right: 0;
      }

      .nav-link {
        margin: 0;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        height: 36px;
        display: flex;
        align-items: center;
      }

      .nav-link mat-icon {
        margin-right: 6px;
      }

      .user-menu-button {
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 36px;
        border-radius: 18px;
        margin-left: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        transition: background-color 0.3s ease;
      }

      .user-menu-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: var(--accent-color);
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        margin-right: 8px;
      }

      .avatar.large {
        width: 48px;
        height: 48px;
        font-size: 1.2rem;
      }

      .user-name {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-menu-button {
        display: none;
        margin-left: 8px;
      }

      .content-container {
        flex: 1;
        position: relative;
        padding-bottom: 24px;
      }

      .router-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .user-info {
        display: flex;
        align-items: center;
        padding: 16px;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
      }

      .user-display-name {
        font-weight: 500;
      }

      .user-email {
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .login-button {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 0 16px;
        border-radius: 18px;
        transition: background-color 0.3s ease;
        height: 36px;
        display: flex;
        align-items: center;
      }

      .login-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      mat-progress-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1001;
      }

      .mat-spinner-color::ng-deep circle {
        stroke: var(--primary-color) !important;
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(3px);
      }

      .env-label {
        position: absolute;
        top: 0;
        left: 0;
        background: var(--primary-color);
        padding: 4px 20px 4px 4px;
        border-radius: 0 0 24px 0;
        color: white;
        font-weight: 500;
        z-index: 999;
      }

      .scrolled {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 768px) {
        mat-toolbar {
          width: 100vw;
          left: 0;
          right: 0;
          margin: 0;
          padding: 0;
          position: fixed;
        }

        .toolbar-container {
          padding: 0 8px;
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .logo-container {
          flex: 1;
        }

        .menu-container {
          flex: 0 0 auto;
        }

        .router-container {
          max-width: none;
          padding: 0 8px;
          margin-top: 64px;
        }

        .content-container {
          margin-top: 64px;
        }

        .nav-text {
          display: none;
        }

        .nav-link {
          min-width: 0;
          padding: 0 8px;
          margin: 0;
        }

        .nav-link mat-icon {
          margin-right: 0;
        }

        .user-name {
          display: none;
        }

        .user-menu-button {
          padding: 0 8px;
          margin-left: 4px;
        }

        .login-button {
          padding: 0 8px;
        }
      }

      @media (max-width: 600px) {
        mat-toolbar {
          padding: 0;
        }

        .toolbar-container {
          padding: 0 8px;
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .logo-container {
          flex: 1;
        }

        .menu-container {
          flex: 0 0 auto;
          gap: 4px;
        }

        .router-container {
          padding: 0 8px;
          margin-top: 64px;
        }

        .nav-link {
          display: none;
        }

        .mobile-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          margin: 0;
          padding: 0;
        }

        .logo-img {
          height: 32px;
          margin-right: 8px;
        }

        .app-title {
          font-size: 1rem;
          margin: 0;
          padding: 0;
        }

        .user-menu-button,
        .login-button {
          margin: 0;
          padding: 0 4px;
        }
      }
    `,
  ],
})
export class AppComponent {
  isScrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

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

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user || !user.displayName) return '?';

    const nameParts = user.displayName.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
