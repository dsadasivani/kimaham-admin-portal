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
    </div>
  `,
  styles: ``,
})
export class DashboardComponent {}
