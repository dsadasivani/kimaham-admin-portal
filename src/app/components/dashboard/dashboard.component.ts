import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatDividerModule],
  template: `
    <div class="card text-center">
      <h2 class="heading" align="center">Welcome to Kimaham</h2>
      <mat-divider style="height: 1em;"></mat-divider>
      <img
        class="mat-elevation-z8 responsive-image"
        src="assets/images/kimaham_welcome_image.jpg"
        alt=""
      />
      <p class="welcome-text">
        <b>KIM AHAM</b> means <b>"WHO AM I"</b> <br />Kim Aham, a school of
        Indian classical dance registered by the State Government of Karnataka,
        organizes professional training of Kuchipudi and Bharatanatyam dance
        repertoires. Here at Kim Aham, we believe that dance is an innate
        emotion in everyone that brings joy and celebration to life and that
        should be shared with others. <br />The students of dance get introduced
        to Indian Mythology and Philosophy.
      </p>
    </div>
  `,
  styles: `
  .responsive-image {
    width: 100%; /* Make the image take full width of its container */
    height: auto; /* Maintain the aspect ratio */
    max-width: 700px; /* Optional: Limit the maximum width */
    display: block; /* Prevent inline spacing issues */
    margin: 0 auto; /* Center the image horizontally */
  }
  .welcome-text {
    max-width: 90%;
    padding: 2em 0em;
    display: inline-block;
    font-size: large;
    font-weight: 100;
  }
  `,
})
export class DashboardComponent {}
