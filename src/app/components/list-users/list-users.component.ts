import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../../services/candidate.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [MatDividerModule, MatTableModule, CommonModule],
  template: `
    <div class="card text-center">
      <h2 class="heading" align="center">List Of Candidates</h2>
      <mat-divider style="height: 1em;"></mat-divider>

      <div class="table-container">
        <table mat-table [dataSource]="candidates()" class="mat-elevation-z8">
          <!-- First Name Column -->
          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef>First Name</th>
            <td mat-cell *matCellDef="let candidate">
              {{ candidate.firstName }}
            </td>
          </ng-container>

          <!-- Last Name Column -->
          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef>Last Name</th>
            <td mat-cell *matCellDef="let candidate">
              {{ candidate.lastName }}
            </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let candidate">{{ candidate.email }}</td>
          </ng-container>

          <!-- Phone Column -->
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let candidate">{{ candidate.phone }}</td>
          </ng-container>

          <!-- Course Column -->
          <ng-container matColumnDef="course">
            <th mat-header-cell *matHeaderCellDef>Course</th>
            <td mat-cell *matCellDef="let candidate">{{ candidate.course }}</td>
          </ng-container>

          <!-- Admission Date Column -->
          <ng-container matColumnDef="admissionDate">
            <th mat-header-cell *matHeaderCellDef>Admission Date</th>
            <td mat-cell *matCellDef="let candidate">
              {{ candidate.admissionDate }}
            </td>
          </ng-container>

          <!-- Course Fee Column -->
          <ng-container matColumnDef="courseFee">
            <th mat-header-cell *matHeaderCellDef>Course Fee</th>
            <td mat-cell *matCellDef="let candidate">
              {{ candidate.courseFee }}
            </td>
          </ng-container>

          <!-- Table Header and Row -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: `
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
  `,
})
export class ListUsersComponent implements OnInit {
  candidates = signal<Candidate[]>([]);
  candidateService = inject(CandidateService);
  notificationService = inject(NotificationService);

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'course',
    'admissionDate',
    'courseFee',
  ];

  ngOnInit(): void {
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
        this.notificationService.hideLoading();
      });
  }
}
