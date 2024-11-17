import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UnderProgressComponent } from '../../under-progress/under-progress.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDividerModule, UnderProgressComponent],
  template: `
    <div class="card text-center">
      <h2 class="heading" align="center">My Profile</h2>
      <mat-divider style="height: 1em;"></mat-divider>
      <app-under-progress></app-under-progress>
    </div>
  `,
  styles: ``,
})
export class ProfileComponent {}
