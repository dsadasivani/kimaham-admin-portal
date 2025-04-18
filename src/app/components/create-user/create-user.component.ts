import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';
import { NotificationService } from '../../services/notification.service';
import { Candidate } from '../../models/candidate';
import { Timestamp } from 'firebase/firestore';
import { calculateAge } from '../../utilities/utility';
import { v4 as uuidv4 } from 'uuid';
import { CandidatePayment } from '../../models/candidate-payment';
import { UsersService } from '../../services/users.service';
import { generateCandidateInvoicePdf } from '../../utilities/pdf-generator';

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
    RouterModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTableModule,
  ],
  template: `
    <div class="page-container">
      <div class="card" matRipple [matRippleRadius]="20">
        <!-- Header Section -->
        <div class="card-header">
          <h2 class="heading">
            {{ isEditMode ? 'Edit Candidate Details' : 'Add New Candidate' }}
          </h2>
          @if (isEditMode) {
          <button
            mat-raised-button
            class="invoice-button"
            (click)="generateInvoice()"
          >
            <mat-icon>download</mat-icon>
            Download Invoice
          </button>
          }
        </div>

        <mat-divider></mat-divider>

        <form [formGroup]="newCandidateForm" class="form-container">
          <!-- Personal Information Section -->
          <div class="section-header">
            <div class="section-title">
              <mat-icon class="section-icon">person</mat-icon>
              <h3>Personal Information</h3>
            </div>
            <div class="section-subtitle">
              Basic details about the candidate
            </div>
          </div>

          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input
                matInput
                formControlName="firstName"
                placeholder="Enter first name"
              />
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="firstName?.hasError('required')">
                First Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input
                matInput
                formControlName="lastName"
                placeholder="Enter last name"
              />
              <mat-icon matSuffix>person_outline</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input
                matInput
                formControlName="email"
                placeholder="Enter email address"
                type="email"
              />
              <mat-icon matSuffix>alternate_email</mat-icon>
              <mat-error *ngIf="email?.hasError('required')">
                Email address is required
              </mat-error>
              <mat-error *ngIf="email?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input
                matInput
                formControlName="phone"
                placeholder="Enter phone number"
                type="tel"
                pattern="[0-9]*"
                maxlength="10"
              />
              <mat-icon matSuffix>phone</mat-icon>
              <mat-error *ngIf="phone?.hasError('required')">
                Phone number is required
              </mat-error>
              <mat-error *ngIf="phone?.hasError('pattern')">
                Please enter only numbers
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date of Birth</mat-label>
              <input
                matInput
                formControlName="dob"
                [matDatepicker]="dobPicker"
                [max]="today"
                placeholder="Choose date"
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="dobPicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #dobPicker></mat-datepicker>
              @if (dob?.value) {
              <mat-hint class="age-hint">Age: {{ getAge() }}</mat-hint>
              } @else {
              <mat-hint>MM/DD/YYYY</mat-hint>
              }
              <mat-error *ngIf="dob?.hasError('required')">
                Date of birth is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Gender</mat-label>
              <mat-select formControlName="gender" placeholder="Select gender">
                <mat-option
                  *ngFor="let gender of genderList()"
                  [value]="gender.key"
                >
                  {{ gender.value }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>wc</mat-icon>
              <mat-error *ngIf="gender?.hasError('required')">
                Please select a gender
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address</mat-label>
            <textarea
              matInput
              formControlName="address"
              placeholder="Enter complete address"
              rows="3"
            ></textarea>
            <mat-icon matSuffix>home</mat-icon>
          </mat-form-field>

          <!-- Course Information Section -->
          <div class="section-header-with-button">
            <div class="section-title">
              <mat-icon class="section-icon">school</mat-icon>
              <h3>Course Information</h3>
            </div>

            @if (isEditMode) {
            <button
              mat-icon-button
              color="primary"
              class="add-course-button"
              (click)="addCourse()"
              [disabled]="courseInfoArray.length >= 3"
            >
              <mat-icon>add</mat-icon>
            </button>
            }
          </div>
          <div class="section-subtitle">Details about enrolled courses</div>
          <br />
          <div class="courses-container">
            <div
              *ngFor="let course of courseInfoArray.controls; let i = index"
              [formGroup]="course"
              class="course-card"
            >
              <div class="course-header">
                <span class="course-number">Course {{ i + 1 }}</span>
                @if (isEditMode && i > 0) {
                <button mat-icon-button color="warn" (click)="removeCourse(i)">
                  <mat-icon>delete</mat-icon>
                </button>
                }
              </div>

              <div class="course-form">
                <mat-form-field appearance="outline">
                  <mat-label>Course Name</mat-label>
                  <mat-select
                    formControlName="course"
                    placeholder="Select course"
                  >
                    <mat-option
                      *ngFor="let course of coursesList()"
                      [value]="course.key"
                    >
                      {{ course.value }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="course.get('course')?.hasError('required')">
                    Please select a course
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Proficiency Level</mat-label>
                  <mat-select
                    formControlName="proficiency"
                    placeholder="Select level"
                  >
                    <mat-option
                      *ngFor="let level of proficiencyList()"
                      [value]="level.key"
                    >
                      {{ level.value }}
                    </mat-option>
                  </mat-select>
                  <mat-error
                    *ngIf="course.get('proficiency')?.hasError('required')"
                  >
                    Please select proficiency level
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            @if (courseInfoArray.length === 0) {
            <div class="no-courses">
              <mat-icon>school</mat-icon>
              <p>No courses added yet</p>
              @if (isEditMode) {
              <button mat-raised-button color="primary" (click)="addCourse()">
                Add Course
              </button>
              }
            </div>
            }
          </div>

          <!-- Payment Information Section -->
          @if (isEditMode) {
          <div class="section-header-with-button">
            <div class="section-title">
              <mat-icon class="section-icon">payments</mat-icon>
              <h3>Payment Information</h3>
            </div>

            <button
              mat-icon-button
              color="primary"
              class="add-payment-button"
              (click)="addPayment()"
            >
              <mat-icon>add</mat-icon>
            </button>
          </div>
          <div class="section-subtitle">Track payments and fees</div>
          <br />
          <div class="payments-container mat-elevation-z2">
            @if (payments.length > 0) {
            <table mat-table [dataSource]="paymentsDataSource">
              <!-- Course Column -->
              <ng-container matColumnDef="course">
                <th mat-header-cell *matHeaderCellDef>Course</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  @if (!payment.get('courseId')?.disabled) {
                  <mat-form-field appearance="outline">
                    <mat-select
                      formControlName="courseId"
                      placeholder="Select Course"
                    >
                      <mat-option
                        *ngFor="let course of getFilteredCourseInfoArray()"
                        [value]="course.get('id')?.value"
                      >
                        {{ transformCourseId(course.get('id')?.value) }}
                      </mat-option>
                      <mat-option value="annual_day">Annual Day</mat-option>
                      <mat-option value="registration">Registration</mat-option>
                      <mat-option value="others">Others</mat-option>
                    </mat-select>
                  </mat-form-field>
                  } @else {
                  {{ transformCourseId(payment.get('courseId')?.value) }}
                  }
                </td>
              </ng-container>

              <!-- Term Column -->
              <ng-container matColumnDef="term">
                <th mat-header-cell *matHeaderCellDef>Term</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  @if (!payment.get('courseId')?.disabled) {
                  <mat-form-field appearance="outline">
                    <mat-select
                      formControlName="term"
                      placeholder="Select term"
                    >
                      <mat-option
                        *ngFor="let term of termList()"
                        [value]="term.key"
                      >
                        {{ term.value }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                  } @else {
                  {{ getTerm(payment.get('term')?.value) }}
                  }
                </td>
              </ng-container>

              <!-- Amount Column -->
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  @if (!payment.get('amount')?.disabled) {
                  <mat-form-field appearance="outline">
                    <mat-icon matPrefix>currency_rupee</mat-icon>
                    <input
                      matInput
                      type="number"
                      formControlName="amount"
                      placeholder="Enter Amount"
                    />
                  </mat-form-field>
                  } @else { ₹{{ payment.get('amount')?.value }}
                  }
                </td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  @if (payment.get('courseId')?.disabled) {
                  {{
                    payment.get('date')?.value | date : 'MMM dd, YYYY hh:mm a'
                  }}
                  }
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="delete">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let payment; let i = index">
                  @if (!payment.get('courseId')?.disabled) {
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="removePayment(i)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                  } @else {
                  <mat-icon class="success-icon">check_circle</mat-icon>
                  }
                </td>
              </ng-container>

              <tr
                mat-header-row
                *matHeaderRowDef="[
                  'course',
                  'term',
                  'amount',
                  'date',
                  'delete'
                ]"
              ></tr>
              <tr
                mat-row
                *matRowDef="
                  let row;
                  columns: ['course', 'term', 'amount', 'date', 'delete']
                "
              ></tr>
            </table>

            @if (hasNewPayments) {
            <div class="save-payments">
              <button
                mat-raised-button
                color="primary"
                (click)="saveNewPayments()"
              >
                <mat-icon>save</mat-icon>
                Save Payments
              </button>
            </div>
            } } @else {
            <div class="no-payments">
              <mat-icon>payments</mat-icon>
              <p>No payment records yet</p>
              <button mat-raised-button color="primary" (click)="addPayment()">
                Add Payment
              </button>
            </div>
            }
          </div>
          }

          <!-- Reference Information Section -->
          <div class="section-header">
            <div class="section-title">
              <mat-icon class="section-icon">share</mat-icon>
              <h3>Reference Information</h3>
            </div>
            <div class="section-subtitle">How did you hear about us?</div>
          </div>

          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Referred By</mat-label>
              <mat-select
                formControlName="referralType"
                placeholder="Select referral type"
              >
                <mat-option
                  *ngFor="let type of referralTypeList()"
                  [value]="type.key"
                >
                  {{ type.value }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>group</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Referrer Name</mat-label>
              <input
                matInput
                formControlName="referralName"
                placeholder="Enter referrer's name"
              />
              <mat-icon matSuffix>person_add</mat-icon>
            </mat-form-field>
          </div>

          <!-- Health Information Section -->
          <div class="section-header">
            <div class="section-title">
              <mat-icon class="section-icon">medical_information</mat-icon>
              <h3>Health Information</h3>
            </div>
            <div class="section-subtitle">
              Important health details we should know about
            </div>
          </div>

          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Pre-existing Conditions</mat-label>
              <mat-select formControlName="healthCondition" multiple>
                <mat-select-trigger>
                  {{healthCondition?.value?.[0] || ''}}
                  @if ((healthCondition?.value?.length || 0) > 1) {
                  <span class="additional-selection">
                    (+{{ (healthCondition?.value?.length || 0) - 1 }}
                    {{
                      healthCondition?.value?.length === 2 ? 'other' : 'others'
                    }})
                  </span>
                  }
                </mat-select-trigger>
                <mat-option
                  *ngFor="let condition of healthConditionList()"
                  [value]="condition"
                >
                  {{ condition }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>health_and_safety</mat-icon>
              <mat-error *ngIf="healthCondition?.hasError('required')">
                Please select relevant condition(s)
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Additional Health Details</mat-label>
              <textarea
                matInput
                formControlName="healthConditionDesc"
                placeholder="Describe any specific health concerns or requirements"
                rows="3"
              ></textarea>
              <mat-icon matSuffix>notes</mat-icon>
            </mat-form-field>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button
              mat-button
              type="button"
              (click)="routerService.navigate(['/list-users'])"
            >
              Cancel
            </button>
            <button
              mat-raised-button
              color="primary"
              (click)="createOrUpdateCandidate()"
              [disabled]="newCandidateForm.invalid || newCandidateForm.pristine"
            >
              {{ isEditMode ? 'Update' : 'Create' }} Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .add-payment-button {
        color: var(--primary-color);
      }
      .add-course-button {
        color: var(--primary-color);
      }
      .page-container {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .card {
        background: white;
        border-radius: var(--border-radius);
        padding: 2rem;
        box-shadow: var(--box-shadow);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .heading {
        font-size: 1.75rem;
        font-weight: 300;
        color: var(--primary-color);
        margin: 0;
      }

      .invoice-button {
        background-color: var(--primary-color);
        color: white;
      }

      .form-container {
        margin-top: 2rem;
      }

      .section-header {
        margin: 2rem 0 1.5rem;
      }
      .section-header-with-button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin: 2rem 0 1.5rem;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0;
          color: var(--text-color);
        }
      }

      .section-icon {
        color: var(--primary-color);
      }

      .section-subtitle {
        color: var(--text-light);
        font-size: 0.9rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .full-width {
        width: 100%;
      }

      .age-hint {
        color: var(--primary-color);
        font-weight: 500;
      }

      .courses-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .course-card {
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem;
        background: #f8f9fa;
      }

      .course-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .course-number {
        font-weight: 500;
        color: var(--primary-color);
      }

      .course-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .no-courses {
        text-align: center;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: var(--border-radius);
        color: var(--text-light);

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
          margin-bottom: 1rem;
        }

        p {
          margin: 0 0 1rem;
        }
      }

      .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
      }

      .payments-container {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        margin-bottom: 2rem;
      }

      .mat-mdc-table {
        width: 100%;
      }

      .mat-mdc-row:nth-child(even) {
        background: #f8f9fa;
      }

      .mat-mdc-header-cell {
        font-weight: 500;
        color: var(--text-color);
      }

      .mat-mdc-cell {
        color: var(--text-color);
      }

      .save-payments {
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
        background: #f8f9fa;
        border-top: 1px solid var(--border-color);
      }

      .no-payments {
        text-align: center;
        padding: 2rem;
        color: var(--text-light);

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
          margin-bottom: 1rem;
        }

        p {
          margin: 0 0 1rem;
        }
      }

      .success-icon {
        color: var(--success-color);
      }

      .additional-selection {
        opacity: 0.75;
        font-size: 0.75em;
      }

      @media (max-width: 600px) {
        .page-container {
          margin: 1rem auto;
        }

        .card {
          padding: 1rem;
        }

        .heading {
          font-size: 1.5rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column-reverse;

          button {
            width: 100%;
          }
        }

        .payments-container {
          margin: 0 -1rem;
          border-radius: 0;
        }

        .mat-mdc-table {
          .mat-mdc-header-row,
          .mat-mdc-row {
            padding: 0 1rem;
          }
        }

        .mat-mdc-cell {
          font-size: 0.875rem;
        }
      }
    `,
  ],
})
export class CreateUserComponent implements OnInit {
  getTerm(term: string): string | undefined {
    return this.termList().find((x) => x.key === term)?.value;
  }
  transformCourseId(courseId: string): string {
    return `${courseId.replace('_', ' (')})`;
  }
  fb = inject(NonNullableFormBuilder);
  candidateService = inject(CandidateService);
  notificationService = inject(NotificationService);
  routerService = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);
  isEditMode = false;
  candidateId: string | null = null;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  paymentsDataSource: any[] = [];
  candidateData: any;
  userService = inject(UsersService);
  currentUser = this.userService.currentUserProfile;

  ngOnInit(): void {
    this.candidateData = {};
    this.route.paramMap.subscribe((params) => {
      this.candidateId = params.get('id');
      this.isEditMode = !!this.candidateId;
      if (this.isEditMode) {
        this.loadCandidateData();
      }
      this.paymentsDataSource = [...this.payments.controls];
    });
  }

  async loadCandidateData() {
    if (!this.candidateId) return;

    try {
      this.notificationService.showLoading();
      this.candidateData = await this.candidateService.getCandidateById(
        this.candidateId
      );
      if (!this.candidateData) {
        return;
      }
      this.loadCandidateFormData(this.candidateData);
      this.notificationService.hideLoading();
    } catch (error) {
      console.log(error);
      this.notificationService.error('Error loading candidate data');
    }
  }

  loadCandidateFormData(candidateData: Candidate) {
    const courseInfoArray = this.newCandidateForm.get(
      'courseInfo'
    ) as FormArray;
    const paymentsArray = this.newCandidateForm.get('payments') as FormArray;
    courseInfoArray.clear();
    paymentsArray.clear();
    candidateData.courseInfo?.forEach((info) => {
      courseInfoArray.push(
        this.fb.group({
          id: [info.id],
          course: [info.course || ''],
          proficiency: [info.proficiency || ''],
          branch: [info.branch || ''],
          admissionDate: [
            info.admissionDate instanceof Timestamp
              ? info.admissionDate.toDate()
              : info.admissionDate || '',
          ],
          endDate: [info.endDate || ''],
          courseFee: [info.courseFee || 0],
          status: [info.status || ''],
        })
      );
    });
    candidateData.payments?.forEach((pay) => {
      paymentsArray.push(
        this.fb.group({
          id: [pay.id],
          courseId: [pay.courseId || ''],
          term: [pay.term || ''],
          amount: [pay.amount || 0],
          date: [pay.date || ''],
          isReadOnly: true,
        })
      );
    });
    paymentsArray.controls.forEach((control) => {
      if (control.get('isReadOnly')?.value) {
        control.get('courseId')?.disable();
        control.get('amount')?.disable();
      }
    });
    this.paymentsDataSource = [...this.payments.controls];
    this.newCandidateForm.patchValue({
      firstName: candidateData.firstName || '',
      lastName: candidateData.lastName || '',
      email: candidateData.email || '',
      phone: candidateData.phone || '',
      dob:
        candidateData.dob instanceof Timestamp
          ? candidateData.dob.toDate()
          : candidateData.dob || '',
      gender: candidateData.gender || '',
      address: candidateData.address || '',
      referralType: candidateData.referralType || '',
      referralName: candidateData.referralName || '',
      healthCondition: candidateData.healthCondition || [],
      healthConditionDesc: candidateData.healthConditionDesc || '',
    });
    if (this.isEditMode) {
      this.newCandidateForm.get('email')?.disable();
    }
  }

  coursesList = signal([
    { key: 'bharatanatyam', value: 'Bharatanatyam ' },
    { key: 'kuchipudi', value: 'Kuchipudi ' },
  ]);
  termList = signal([
    { key: 'term1', value: 'Term I (June-Sept)' },
    { key: 'term2', value: 'Term II (Oct-Jan)' },
    { key: 'term3', value: 'Term III (Feb-May)' },
  ]);
  proficiencyList = signal([
    { key: 'prathamika', value: 'Prathamika' },
    { key: 'avara', value: 'Avara' },
    { key: 'madhyam', value: 'Madhyam' },
    { key: 'jyestha', value: 'Jyestha' },
  ]);
  branchList = signal([
    { key: 'B1', value: 'sobha silicon oasis' },
    { key: 'B2', value: 'adarsh palm retreat' },
    { key: 'B3', value: 'Kim Aham School Of Dance(Thubarahalli)' },
  ]);
  genderList = signal([
    { key: 'F', value: 'Female ♀️' },
    { key: 'M', value: 'Male ♂️' },
    { key: 'O', value: 'Others ⚧️' },
    { key: 'X', value: 'I prefer not to say 🛑' },
  ]);
  referralTypeList = signal([
    { key: 'family', value: 'Family 👨‍👩‍👧‍👦' },
    { key: 'friend', value: 'friend 🧑‍🤝‍🧑' },
    { key: 'direct', value: 'Direct' },
  ]);
  healthConditionList = signal([
    'Ligament Issues',
    'Dust Allergy',
    'Asthma',
    'Neural Issues',
    'others',
    'ALL GOOD',
  ]);

  newCandidateForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    address: [''],
    courseInfo: this.fb.array([
      this.fb.group({
        id: [''],
        course: ['', Validators.required],
        proficiency: ['', Validators.required],
        branch: ['', Validators.required],
        admissionDate: ['', Validators.required],
        endDate: [''],
        courseFee: [0, Validators.required],
        status: ['ACTIVE'],
      }),
    ]),
    payments: this.fb.array([]),
    referralType: [''],
    referralName: [''],
    healthCondition: [[''], Validators.required],
    healthConditionDesc: [''],
  });

  firstName = this.newCandidateForm.get('firstName');
  email = this.newCandidateForm.get('email');
  phone = this.newCandidateForm.get('phone');
  dob = this.newCandidateForm.get('dob');
  gender = this.newCandidateForm.get('gender');
  healthCondition = this.newCandidateForm.get('healthCondition');
  today: any = new Date();

  async createOrUpdateCandidate() {
    this.newCandidateForm.markAllAsTouched();
    let email = this.candidateData.email;
    let { courseInfo, payments, ...data } = this.newCandidateForm.value;
    payments = this.candidateData.payments ? this.candidateData.payments : [];
    const courseInfoObj = courseInfo?.at(0);
    if (
      !this.newCandidateForm.valid ||
      !email ||
      !data.firstName ||
      !data.phone ||
      !data.dob ||
      !data.gender ||
      !data.healthCondition ||
      !courseInfoObj?.course ||
      !courseInfoObj?.proficiency ||
      !courseInfoObj?.admissionDate ||
      !courseInfoObj?.courseFee
    ) {
      return;
    }
    try {
      courseInfo?.map(
        (course) => (course.id = `${course.course}_${course.proficiency}`)
      );
      this.notificationService.showLoading();
      const createFields = {
        createdBy: this.currentUser()?.email,
        createdOn: new Date(),
      };
      const updateFields = {
        updatedBy: this.currentUser()?.email,
        updatedOn: new Date(),
      };
      if (this.isEditMode) {
        await this.candidateService.addOrUpdateCandidate(
          {
            email,
            courseInfo,
            payments,
            ...data,
            ...updateFields,
          },
          this.isEditMode
        );
      } else {
        await this.candidateService.addOrUpdateCandidate(
          {
            email,
            courseInfo,
            payments,
            ...data,
            ...createFields,
          },
          this.isEditMode
        );
      }
      this.notificationService.success(
        this.isEditMode
          ? 'Candidate details updated successfully !!'
          : 'Candidate registration success !!'
      );
      if (!this.isEditMode) {
        this.newCandidateForm.reset();
        this.routerService.navigate(['list-users']);
      } else {
        this.loadCandidateData();
      }
    } catch (error: any) {
      console.log(error);
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }
  getAge(): string {
    return calculateAge(this.newCandidateForm.get('dob')?.value);
  }
  addCourse() {
    const newCourseGroup = this.fb.group({
      id: [''],
      course: ['', Validators.required],
      proficiency: ['', Validators.required],
      admissionDate: ['', Validators.required],
      endDate: [''],
      courseFee: [0, Validators.required],
      status: ['ACTIVE'],
    });
    this.courseInfoArray.push(newCourseGroup);
  }

  get courseInfoArray(): FormArray<FormGroup> {
    return this.newCandidateForm.get('courseInfo') as FormArray<FormGroup>;
  }
  getFilteredCourseInfoArray(): FormGroup[] {
    return this.courseInfoArray.controls.filter(
      (group) => group.get('id')?.value
    );
  }
  addPayment() {
    this.payments.push(
      this.fb.group({
        id: uuidv4(),
        courseId: ['', Validators.required],
        term: ['', Validators.required],
        amount: [0, Validators.required],
        date: [new Date().toISOString(), Validators.required],
      })
    );
    this.paymentsDataSource = [...this.payments.controls];
    this.cdr.detectChanges();
  }
  get payments(): FormArray {
    return this.newCandidateForm.get('payments') as FormArray;
  }
  removePayment(index: number) {
    this.payments.removeAt(index);
    this.paymentsDataSource = [...this.payments.controls];
    this.cdr.detectChanges();
  }
  get hasNewPayments(): boolean {
    return this.payments.controls.some(
      (payment) => !payment.get('isReadOnly')?.value
    );
  }
  async saveNewPayments() {
    const candidateId = this.newCandidateForm.get('email')?.value;
    if (!candidateId) {
      return;
    }
    const newPayments = this.payments.controls
      .filter((payment) => !payment.get('isReadOnly')?.value)
      .map((payment) => payment.value);
    try {
      this.notificationService.showLoading();
      newPayments.map((x) => {
        x.createdBy = this.currentUser()?.email;
        x.createdOn = new Date();
      });
      await this.candidateService.addNewPayments(
        candidateId,
        newPayments as CandidatePayment[]
      );
      this.loadCandidateData();
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }
  generateInvoice() {
    const processedCandidateData = {
      ...this.candidateData,
      courseInfo: this.candidateData.courseInfo?.map((course: any) => ({
        ...course,
        admissionDate:
          course.admissionDate instanceof Timestamp
            ? course.admissionDate.toDate().toLocaleDateString()
            : course.admissionDate,
        endDate:
          course.endDate instanceof Timestamp
            ? course.endDate.toDate().toLocaleDateString()
            : course.endDate,
      })),
      payments: this.candidateData.payments?.map((payment: any) => ({
        ...payment,
        paymentDate:
          payment.paymentDate instanceof Timestamp
            ? payment.paymentDate.toDate().toLocaleDateString()
            : payment.paymentDate,
      })),
      dob:
        this.candidateData.dob instanceof Timestamp
          ? this.candidateData.dob.toDate().toLocaleDateString()
          : this.candidateData.dob,
    };
    generateCandidateInvoicePdf(processedCandidateData);
  }
  removeCourse(index: number) {
    this.courseInfoArray.removeAt(index);
    this.newCandidateForm.markAsDirty();
  }
}
