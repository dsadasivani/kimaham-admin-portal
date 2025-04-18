import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../../services/candidate.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(15px)' }),
            stagger(60, [
              animate(
                '0.3s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  template: `
    <div class="list-users-container" @fadeIn>
      <!-- Header section -->
      <section class="page-header">
        <div>
          <h1 class="page-title">Candidate Management</h1>
          <p class="page-subtitle">View and manage all registered candidates</p>
        </div>
        <button
          mat-raised-button
          color="primary"
          routerLink="/create-user"
          class="add-button"
        >
          <mat-icon>person_add</mat-icon>
          Add New Candidate
        </button>
      </section>

      <mat-card class="content-card">
        <!-- Search and Filter -->
        <div class="search-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search candidates</mat-label>
            <input
              matInput
              placeholder="Search by name, email, or phone"
              [(ngModel)]="searchQuery"
              (keyup)="applyFilter()"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <div class="filter-tags" *ngIf="activeFilters.length > 0">
            <span class="filter-label">Active filters:</span>
            <mat-chip-set>
              <mat-chip
                *ngFor="let filter of activeFilters"
                (removed)="removeFilter(filter)"
              >
                {{ filter }}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
            </mat-chip-set>
          </div>
        </div>

        <!-- No data state -->
        @if (filteredCandidates().length === 0) {
        <div class="no-data-container" @fadeIn>
          <mat-icon class="no-data-icon">no_accounts</mat-icon>
          <h3 class="no-data-title">No candidates found</h3>
          <p class="no-data-message">
            @if (loading) { Loading candidates, please wait... } @else if
            (searchQuery) { No candidates match your search criteria.
            <button mat-button color="primary" (click)="clearSearch()">
              Clear Search
            </button>
            } @else { There are no candidates registered in the system.
            <button mat-button color="primary" routerLink="/create-user">
              Add Candidate
            </button>
            }
          </p>
        </div>
        } @else {
        <!-- Data table -->
        <div class="table-container" @listAnimation>
          <table
            mat-table
            [dataSource]="paginatedCandidates()"
            class="mat-elevation-z0"
            matSort
            (matSortChange)="sortData($event)"
          >
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="firstName">
                Candidate Name
              </th>
              <td mat-cell *matCellDef="let candidate" class="name-cell">
                <div class="candidate-info">
                  <div class="candidate-avatar">
                    {{ getInitials(candidate) }}
                  </div>
                  <div class="candidate-name">
                    {{ candidate.firstName }} {{ candidate.lastName }}
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="email">
                Email
              </th>
              <td mat-cell *matCellDef="let candidate">
                <a
                  [routerLink]="['/edit-user', candidate.email]"
                  class="email-link"
                  matTooltip="Click to edit this candidate"
                >
                  {{ candidate.email }}
                </a>
              </td>
            </ng-container>

            <!-- Phone Column -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let candidate">
                <a href="tel:{{ candidate.phone }}" class="phone-link">
                  {{ formatPhone(candidate.phone) }}
                </a>
              </td>
            </ng-container>

            <!-- Courses Column -->
            <ng-container matColumnDef="courses">
              <th mat-header-cell *matHeaderCellDef>Courses</th>
              <td mat-cell *matCellDef="let candidate">
                <div class="courses-container">
                  @if (candidate.courseInfo?.length > 0) {
                  <mat-chip-set>
                    @for (course of candidate.courseInfo; track course.id) {
                    <mat-chip class="course-chip">
                      {{ formatCourseId(course.id) }}
                    </mat-chip>
                    }
                  </mat-chip-set>
                  } @else {
                  <span class="no-courses">No courses enrolled</span>
                  }
                </div>
              </td>
            </ng-container>

            <!-- Action Column -->
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let candidate">
                <div class="action-buttons">
                  <button
                    mat-icon-button
                    color="primary"
                    [routerLink]="['/edit-user', candidate.email]"
                    matTooltip="Edit candidate"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>

                  <button
                    mat-icon-button
                    color="warn"
                    matTooltip="Delete candidate"
                    (click)="confirmDelete(candidate)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr
              mat-header-row
              *matHeaderRowDef="displayedColumns"
              class="header-row"
            ></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="data-row"
              [routerLink]="['/edit-user', row.email]"
            ></tr>
          </table>

          <!-- Paginator -->
          <mat-paginator
            [length]="filteredCandidates().length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="handlePageEvent($event)"
            showFirstLastButtons
            class="paginator"
          ></mat-paginator>
        </div>
        }
      </mat-card>
    </div>
  `,
  styles: `
    .list-users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    /* Header section */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .page-title {
      font-size: 2rem;
      font-weight: 300;
      margin: 0;
      color: var(--primary-color);
    }
    
    .page-subtitle {
      color: var(--text-light);
      margin: 0.5rem 0 0;
    }
    
    .add-button {
      background-color: var(--primary-color);
      color: white;
    }
    
    /* Content card */
    .content-card {
      border-radius: var(--border-radius);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    /* Search section */
    .search-container {
      margin-bottom: 1.5rem;
    }
    
    .search-field {
      width: 100%;
      max-width: 500px;
    }
    
    .filter-tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .filter-label {
      color: var(--text-light);
      font-size: 0.9rem;
    }
    
    /* No data state */
    .no-data-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }
    
    .no-data-icon {
      font-size: 4rem;
      height: 4rem;
      width: 4rem;
      color: var(--text-light);
      opacity: 0.5;
      margin-bottom: 1rem;
    }
    
    .no-data-title {
      font-size: 1.5rem;
      font-weight: 300;
      margin: 0 0 0.5rem;
      color: var(--text-color);
    }
    
    .no-data-message {
      color: var(--text-light);
      max-width: 400px;
      margin: 0 auto;
    }
    
    /* Table styles */
    .table-container {
      overflow: auto;
      border-radius: var(--border-radius);
    }
    
    table {
      width: 100%;
    }
    
    .header-row {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    .data-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .data-row:hover {
      background-color: rgba(124, 19, 22, 0.05);
    }
    
    /* Cell styling */
    .name-cell {
      min-width: 200px;
    }
    
    .candidate-info {
      display: flex;
      align-items: center;
    }
    
    .candidate-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      margin-right: 12px;
    }
    
    .email-link, .phone-link {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .email-link:hover, .phone-link:hover {
      color: var(--primary-light);
      text-decoration: underline;
    }
    
    .courses-container {
      max-width: 300px;
    }
    
    .course-chip {
      font-size: 0.8rem;
      height: 24px;
      background-color: rgba(124, 19, 22, 0.1);
      color: var(--primary-color);
    }
    
    .no-courses {
      color: var(--text-light);
      font-style: italic;
      font-size: 0.9rem;
    }
    
    /* Action buttons */
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .data-row:hover .action-buttons {
      opacity: 1;
    }
    
    /* Paginator */
    .paginator {
      margin-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .courses-container {
        max-width: 200px;
      }
    }
    
    @media (max-width: 600px) {
      .content-card {
        padding: 1rem;
      }
      
      .table-container {
        margin: 0 -1rem;
        width: calc(100% + 2rem);
      }
    }
  `,
})
export class ListUsersComponent implements OnInit {
  candidates = signal<Candidate[]>([]);
  filteredCandidates = signal<Candidate[]>([]);
  paginatedCandidates = signal<Candidate[]>([]);
  candidateService = inject(CandidateService);
  notificationService = inject(NotificationService);
  loading: boolean = false;

  // Search and filtering
  searchQuery: string = '';
  activeFilters: string[] = [];

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;

  // Sorting
  currentSort: Sort = { active: 'firstName', direction: 'asc' };

  displayedColumns: string[] = ['name', 'email', 'phone', 'courses', 'action'];

  ngOnInit(): void {
    this.loading = true;
    this.notificationService.showLoading();
    this.candidateService
      .getAllCandidates()
      .then((data: Candidate[]) => {
        this.candidates.set(data);
        this.filteredCandidates.set(data);
        this.updatePaginatedData();
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

  getInitials(candidate: Candidate): string {
    if (!candidate.firstName && !candidate.lastName) return '?';

    const firstInitial = candidate.firstName
      ? candidate.firstName.charAt(0).toUpperCase()
      : '';
    const lastInitial = candidate.lastName
      ? candidate.lastName.charAt(0).toUpperCase()
      : '';

    return firstInitial + lastInitial;
  }

  formatPhone(phone: string): string {
    if (!phone) return 'N/A';

    // Simple formatting for demonstration
    if (phone.length === 10) {
      return `(${phone.substring(0, 3)}) ${phone.substring(
        3,
        6
      )}-${phone.substring(6)}`;
    }

    return phone;
  }

  formatCourseId(courseId: string): string {
    if (!courseId) return '';
    return courseId.replace('_', ' (') + ')';
  }

  getCourseIds(courseInfo: any[]): string {
    if (!courseInfo || courseInfo.length === 0) return 'None';
    return courseInfo
      .map((course) => this.formatCourseId(course.id))
      .join(', ');
  }

  applyFilter(): void {
    if (!this.searchQuery?.trim()) {
      this.filteredCandidates.set(this.candidates());
      this.activeFilters = [];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredCandidates.set(
        this.candidates().filter(
          (candidate) =>
            candidate.firstName?.toLowerCase().includes(query) ||
            candidate.lastName?.toLowerCase().includes(query) ||
            candidate.email?.toLowerCase().includes(query) ||
            (candidate.phone && candidate.phone.toString().includes(query))
        )
      );

      // Update active filters
      this.activeFilters = [this.searchQuery.trim()];
    }

    this.currentPage = 0;
    this.updatePaginatedData();
    this.sortData(this.currentSort);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilter();
  }

  removeFilter(filter: string): void {
    this.activeFilters = this.activeFilters.filter((f) => f !== filter);
    this.searchQuery = '';
    this.applyFilter();
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCandidates.set(this.filteredCandidates().slice(start, end));
  }

  sortData(sort: Sort): void {
    this.currentSort = sort;

    if (!sort.active || sort.direction === '') {
      this.updatePaginatedData();
      return;
    }

    const data = [...this.filteredCandidates()];

    data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName':
          return this.compare(a.firstName, b.firstName, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        default:
          return 0;
      }
    });

    this.filteredCandidates.set(data);
    this.updatePaginatedData();
  }

  compare(
    a: string | undefined,
    b: string | undefined,
    isAsc: boolean
  ): number {
    const valueA = a || '';
    const valueB = b || '';
    return (
      (valueA.toLowerCase() < valueB.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1)
    );
  }

  confirmDelete(candidate: Candidate): void {
    // Implementation for delete confirmation would go here
    // This would typically show a dialog asking for confirmation
    console.log('Delete candidate:', candidate);
  }
}
