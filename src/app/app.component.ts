import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

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
  ],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z5">
      <img
        class="logo-img"
        src="assets/images/logo.png"
        title="KIMAHAM - Admin Portal"
      />
      <button
        mat-mini-fab
        [mat-menu-trigger-for]="userMenu"
        style="border: none;"
      >
        <mat-icon>menu</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item routerLink="/">
          <mat-icon>account_circle</mat-icon>
          My Profile
        </button>
        <!-- <mat-divider></mat-divider> -->
        <div style="margin: 0px 10px">
          <mat-divider></mat-divider>
        </div>
        <button mat-menu-item routerLink="/">
          <mat-icon>groups</mat-icon>
          List Candidates
        </button>
        <button mat-menu-item routerLink="/">
          <mat-icon>person_add</mat-icon>
          Add Candidate
        </button>
      </mat-menu>
    </mat-toolbar>

    <router-outlet />
  `,
  styles: [
    `
      mat-toolbar {
        font-weight: lighter;
        // justify-content: center;
        justify-content: space-between;
      }
      .logo-img {
        margin: 1vh;
        width: 2em;
      }
    `,
  ],
})
export class AppComponent {
  title = 'kimaham-admin-portal';
}
