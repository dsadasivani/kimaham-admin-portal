import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.5s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
  template: `
    <div class="dashboard-container">
      <!-- Hero section -->
      <section class="hero-section" @fadeIn>
        <div class="hero-content">
          <h1 class="hero-title">
            Welcome to <span class="highlight">KIMAHAM</span>
          </h1>
          <p class="hero-subtitle">School of Indian Classical Dance</p>
          <div class="hero-actions">
            <a
              mat-raised-button
              color="primary"
              routerLink="/list-users"
              class="cta-button"
            >
              <mat-icon>groups</mat-icon>
              View Candidates
            </a>
            <a
              mat-raised-button
              routerLink="/create-user"
              class="secondary-button"
            >
              <mat-icon>person_add</mat-icon>
              Add Candidate
            </a>
          </div>
        </div>
        <div class="hero-image-container">
          <img
            class="hero-image mat-elevation-z4"
            src="assets/images/kimaham_welcome_image.jpg"
            alt="Kimaham Dance"
          />
        </div>
      </section>

      <!-- About section -->
      <section class="about-section" @fadeIn>
        <div class="section-header">
          <h2 class="section-title">About Kimaham</h2>
          <mat-divider></mat-divider>
        </div>

        <div class="about-content">
          <div class="about-text">
            <p>
              <span class="highlight-text">KIM AHAM</span> means
              <span class="highlight-text">"WHO AM I"</span>
            </p>
            <p>
              Kim Aham, a school of Indian classical dance registered by the
              State Government of Karnataka, organizes professional training of
              Kuchipudi and Bharatanatyam dance repertoires.
            </p>
            <p>
              Here at Kim Aham, we believe that dance is an innate emotion in
              everyone that brings joy and celebration to life and that should
              be shared with others.
            </p>
            <p>
              The students of dance get introduced to Indian Mythology and
              Philosophy through our comprehensive programs.
            </p>
          </div>

          <div class="about-features">
            <mat-card class="feature-card" @fadeIn>
              <mat-icon class="feature-icon">school</mat-icon>
              <h3>Professional Training</h3>
              <p>Expert guidance in Kuchipudi and Bharatanatyam dance forms</p>
            </mat-card>

            <mat-card class="feature-card" @fadeIn>
              <mat-icon class="feature-icon">auto_stories</mat-icon>
              <h3>Cultural Education</h3>
              <p>Introduction to Indian Mythology and Philosophy</p>
            </mat-card>

            <mat-card class="feature-card" @fadeIn>
              <mat-icon class="feature-icon">groups</mat-icon>
              <h3>Community</h3>
              <p>Join a vibrant community of dance enthusiasts</p>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Admin tools section -->
      <section class="admin-tools-section" @fadeIn>
        <div class="section-header">
          <h2 class="section-title">Admin Tools</h2>
          <mat-divider></mat-divider>
        </div>

        <div class="tools-grid">
          <mat-card class="tool-card" routerLink="/list-users">
            <mat-icon class="tool-icon">people</mat-icon>
            <h3>Manage Candidates</h3>
            <p>View and edit candidate information</p>
            <button mat-button color="primary">
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <mat-card class="tool-card" routerLink="/create-user">
            <mat-icon class="tool-icon">person_add</mat-icon>
            <h3>Add New Candidate</h3>
            <p>Register new dance students</p>
            <button mat-button color="primary">
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <mat-card class="tool-card" routerLink="/user/profile">
            <mat-icon class="tool-icon">account_circle</mat-icon>
            <h3>My Profile</h3>
            <p>View and edit your profile</p>
            <button mat-button color="primary">
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>
        </div>
      </section>
    </div>
  `,
  styles: `
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    /* Hero Section */
    .hero-section {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 4rem;
      gap: 2rem;
    }
    
    .hero-content {
      flex: 1;
      min-width: 300px;
    }
    
    .hero-title {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 1rem;
      color: var(--text-color);
    }
    
    .highlight {
      color: var(--primary-color);
      font-weight: 500;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-light);
      margin-bottom: 2rem;
    }
    
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .cta-button {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1.5rem;
    }
    
    .secondary-button {
      background-color: white;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
    
    .hero-image-container {
      flex: 1;
      min-width: 300px;
      display: flex;
      justify-content: center;
    }
    
    .hero-image {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      transition: transform 0.3s ease;
    }
    
    .hero-image:hover {
      transform: scale(1.02);
    }
    
    /* Section styles */
    .section-header {
      margin-bottom: 2rem;
    }
    
    .section-title {
      font-size: 1.8rem;
      font-weight: 300;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }
    
    /* About section */
    .about-section {
      margin-bottom: 4rem;
    }
    
    .about-content {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .about-text {
      flex: 2;
      min-width: 300px;
      font-size: 1.1rem;
      line-height: 1.6;
    }
    
    .highlight-text {
      font-weight: 500;
      color: var(--primary-color);
    }
    
    .about-features {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .feature-card {
      padding: 1.5rem;
      border-radius: var(--border-radius);
      border-left: 4px solid var(--primary-color);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--box-shadow);
    }
    
    .feature-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    /* Admin tools section */
    .admin-tools-section {
      margin-bottom: 3rem;
    }
    
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .tool-card {
      padding: 1.5rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .tool-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--box-shadow);
    }
    
    .tool-icon {
      font-size: 2.5rem;
      height: 2.5rem;
      width: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    .tool-card h3 {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .tool-card p {
      color: var(--text-light);
      margin-bottom: 1rem;
      flex-grow: 1;
    }
    
    .tool-card button {
      align-self: flex-end;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .hero-section, .about-content {
        flex-direction: column;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-actions {
        flex-direction: column;
        width: 100%;
      }
      
      .hero-actions a {
        width: 100%;
      }
    }
  `,
})
export class DashboardComponent {}
