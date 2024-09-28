import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
  ],
  template: `
    <div class="card text-center">
      <h2 class="heading" align="center">Candidate On-boarding</h2>
      <mat-divider style="height: 1em;"></mat-divider>
      <form action="">
        <div class="row">
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
          <!-- </div> -->
          <!-- <div class="row"> -->
          <mat-form-field>
            <mat-label>Email</mat-label>
            <mat-icon matSuffix>alternate_email</mat-icon>
            <input matInput formControlName="email" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Phone</mat-label>
            <mat-icon matSuffix>phone</mat-icon>
            <input type="number" matInput formControlName="phone" />
          </mat-form-field>
        </div>
        <mat-form-field>
          <mat-label>Address</mat-label>
          <textarea
            matInput
            formControlName="address"
            placeholder="Ex. Koramangala, ..."
          ></textarea>
        </mat-form-field>
        <div class="row">
          <mat-form-field>
            <mat-label>Course</mat-label>
            <mat-select>
              <mat-option value="Bharatanatyam">Bharatanatyam</mat-option>
              <mat-option value="Kuchipudi">Kuchipudi</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Date of Admission</mat-label>
            <input matInput [matDatepicker]="picker" />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Amount Paid</mat-label>
            <mat-icon matPrefix>currency_rupee</mat-icon>
            <input type="number" matInput formControlName="payment" />
          </mat-form-field>
        </div>
        <div class="center margin-top">
          <button mat-flat-button class="create-button">Create</button>
        </div>
      </form>
    </div>
  `,
  styles: `
  .heading {
    font-size: 2em;
    font-weight: lighter;
  }
  .row {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  .create-button {
    background-color: #7c1316 !important; 
    color: white !important;
  }
  .create-button:hover {
    background-color: white !important; 
    color: #7c1316 !important;
    font-size: 1em;
    font-weight: lighter;
    border: solid 1px #7c1316;
  }
  `,
})
export class CreateUserComponent {}
