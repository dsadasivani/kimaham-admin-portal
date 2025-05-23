import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../../services/candidate.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    MatDividerModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
  ],
  template: `
    <div class="card text-center">
      <h2 class="heading" align="center">List Of Candidates</h2>
      <mat-divider style="height: 1em;"></mat-divider>
      @if (candidates().length === 0 && !loading) {
      <div class="no-data-img">
        <mat-icon style="padding: 0 2rem; font-size: 3em; height: auto;"
          >no_accounts</mat-icon
        >
        <p style="    padding-top: 2%;font-size: 20px;font-weight: 100;">
          No candidates to show...
        </p>
      </div>
      } @else if (candidates().length > 0) {
      <div class="table-container">
        <table mat-table [dataSource]="candidates()" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let candidate">
              {{ candidate.firstName }} {{ candidate.lastName }}
            </td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let candidate">
              <a [routerLink]="['/edit-user', candidate.email]">{{
                candidate.email
              }}</a>
            </td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let candidate">
              {{ candidate.phone }}
            </td>
          </ng-container>
          <ng-container matColumnDef="courses">
            <th mat-header-cell *matHeaderCellDef>Course</th>
            <td mat-cell *matCellDef="let candidate">
              {{ getCourseIds(candidate.courseInfo) }}
            </td>
          </ng-container>
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let candidate">
              <button
                mat-icon-button
                color="warn"
                [routerLink]="['/edit-user', candidate.email]"
              >
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
      }
    </div>
  `,
  styles: `
  .no-data-img {
    display: flex;
    justify-content: center;
  }
  .table-container {
    overflow: auto;
    border: solid 2px lightgrey;
    border-radius: 1em;
}

table {
  width: 100%;
}

th.mat-header-cell, td.mat-cell {
  padding: 8px;
}
::ng-deep .mat-column-name {
  min-width: 10em;
}
::ng-deep .mat-column-action {
  width: 6em;
}
::ng-deep .mat-column-phone {
  min-width: 10em;
}
::ng-deep .mat-column-courses {
  min-width: 15em;
}
  `,
})
export class ListUsersComponent implements OnInit {
  candidates = signal<Candidate[]>([]);
  candidateService = inject(CandidateService);
  notificationService = inject(NotificationService);
  loading: boolean = false;

  displayedColumns: string[] = ['name', 'email', 'phone', 'courses', 'action'];

  ngOnInit(): void {
    this.loading = true;
    this.notificationService.showLoading();
    this.candidateService
      .getAllCandidates()
      .then((data: Candidate[]) => {
        this.candidates.set(data);
      })
      .catch((error: any) => {
        this.notificationService.firebaseError(error);
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
        this.notificationService.hideLoading();
      });
  }
  getCourseIds(courseInfo: any[]): string {
    return courseInfo
      .map((course) => `${course.id.replace('_', ' (')})`)
      .join(', ');
  }
}
