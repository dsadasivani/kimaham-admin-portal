import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDividerModule],
  template: `
    <div class="card text-center">
      <h2 class="heading" align="center">My Profile</h2>
      <mat-divider style="height: 1em;"></mat-divider>
    </div>
  `,
  styles: ``,
})
export class ProfileComponent {}
