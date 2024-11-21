import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { UsersService } from '../../../services/users.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  template: `
    <div class="login-card mat-elevation-z5">
      <div class="login-header-image">
        <img
          src="assets/images/logo.png"
          width="100"
          height="100"
          class="margin-top mat-elevation-z1"
        />
      </div>
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <mat-form-field>
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="email?.hasError('required')">
            Email address is required
          </mat-error>
          <mat-error *ngIf="email?.hasError('email')">
            Email address is not valid
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input type="password" matInput formControlName="password" />
          <mat-error *ngIf="password?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>
        <div class="center margin-top">
          <button
            class="submit-button"
            type="submit"
            mat-raised-button
            color="primary"
          >
            Login
          </button>
        </div>
        <div class="login-footer">
          <!-- <a [ariaDisabled]="true" class="sign-up" routerLink="/sign-up"
            >Create Account</a
          > -->
          <a (click)="forgotPassword()">Forgot Password?</a>
        </div>
      </form>
    </div>
  `,
  styles: `
  .login-footer {
    display: flex;
    justify-content: center;
    margin-top: 3vh;
  }
  .login-card {
    display: block;
    max-width: 300px;
    margin: auto;
    margin-top: 3em;
    padding: 48px;
    border-radius: 16px;

    mat-form-field {
      width: 100%;
    }
    .center {
    display: flex;
    justify-content: center;
    }
    h1 {
      margin-bottom: 32px;
    }
  }
  a {
    cursor: pointer;
    text-decoration: underline;
    color: darkblue;
  }
  .margin-top {
  margin-top: 16px !important;
}
.login-header-image {
    position: relative;
    width: 120px;
    margin: auto;
    display: flex;
    justify-content: center;
    padding-bottom: 1em;
    > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  `,
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UsersService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  email = this.loginForm.get('email');
  password = this.loginForm.get('password');

  async login() {
    const { email, password } = this.loginForm.value;
    if (!this.loginForm.valid || !email || !password) {
      return;
    }
    try {
      this.notificationService.showLoading();
      const {
        user: { uid },
      } = await this.authService.login(email, password);
      this.notificationService.success('Logged in successfully');
      this.router.navigate(['home']);
      if (!(await this.userService.checkUserExists(uid)).valueOf()) {
        await this.userService.addUser({ uid, email });
      }
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }

  async forgotPassword() {
    const { email } = this.loginForm.value;
    if (!email) {
      this.notificationService.error('Please enter valid email address.');
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.passwordReset(email);
      this.notificationService.success(
        'Password reset email has been sent. Please check the your inbox'
      );
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
