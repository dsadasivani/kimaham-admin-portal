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
    <div class="card text-center" matRipple [matRippleRadius]="20">
      <h2 class="heading" align="center">
        {{ isEditMode ? 'Candidate Details' : 'Candidate On-boarding' }}
      </h2>
      <mat-divider></mat-divider>
      <form [formGroup]="newCandidateForm">
        <h3 class="side-heading" align="left">
          <mat-icon class="side-heading-icon">tag</mat-icon>Personal
          Info<mat-icon class="side-heading-icon">arrow_right</mat-icon>
        </h3>
        <div class="row">
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" />
            <mat-error *ngIf="firstName?.hasError('required')">
              First Name is required
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <mat-icon matSuffix>alternate_email</mat-icon>
            <input matInput formControlName="email" />
            <mat-error *ngIf="email?.hasError('required')">
              Email address is required
            </mat-error>
            <mat-error *ngIf="email?.hasError('email')">
              Email address is not valid
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Phone</mat-label>
            <mat-icon matSuffix>phone</mat-icon>
            <input type="number" matInput formControlName="phone" />
            <mat-error *ngIf="phone?.hasError('required')">
              Phone Number is required
            </mat-error>
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field>
            <mat-label>Date of Birth</mat-label>
            <input
              matInput
              formControlName="dob"
              [matDatepicker]="dobPicker"
              [max]="today"
            />
            @if (dob?.hasError('required')) {
            <mat-hint>MM/DD/YYYY</mat-hint>
            }@else {
            <mat-hint style="color: darkgreen;">{{ getAge() }}</mat-hint>
            }

            <mat-datepicker-toggle
              matIconSuffix
              [for]="dobPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #dobPicker></mat-datepicker>
            <mat-error *ngIf="dob?.hasError('required')">
              DOB is required
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender">
              <mat-option
                *ngFor="let gender of genderList()"
                [value]="gender.key"
                >{{ gender.value }}</mat-option
              >
            </mat-select>
            <mat-error *ngIf="gender?.hasError('required')">
              Please select gender
            </mat-error>
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
        <div class="add-course-container">
          <h3 class="side-heading" align="left">
            <mat-icon class="side-heading-icon">tag</mat-icon>Course
            Info<mat-icon class="side-heading-icon">arrow_right</mat-icon>
          </h3>
          <button
            *ngIf="isEditMode"
            mat-icon-button
            class="submit-button"
            (click)="addCourse()"
          >
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div
          *ngFor="let course of courseInfoArray.controls; let i = index"
          [formGroup]="course"
          class="row mat-elevation-z8 course-row"
        >
          <mat-form-field class="course-fields">
            <mat-label>Course</mat-label>
            <mat-select formControlName="course">
              <mat-option
                *ngFor="let course of coursesList()"
                [value]="course.key"
              >
                {{ course.value }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="course.get('course')?.hasError('required')">
              Select valid course
            </mat-error>
          </mat-form-field>
          <mat-form-field class="course-fields">
            <mat-label>Proficiency</mat-label>
            <mat-select formControlName="proficiency">
              <mat-option
                *ngFor="let proficiency of proficiencyList()"
                [value]="proficiency.key"
              >
                {{ proficiency.value }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="course.get('proficiency')?.hasError('required')">
              Please select proficiency
            </mat-error>
          </mat-form-field>
          <mat-form-field class="course-fields">
            <mat-label>Date of Admission</mat-label>
            <input
              matInput
              formControlName="admissionDate"
              [matDatepicker]="picker"
            />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error
              *ngIf="course.get('admissionDate')?.hasError('required')"
            >
              Admission Date is required
            </mat-error>
          </mat-form-field>
          <mat-form-field class="course-fields">
            <mat-label>End Date</mat-label>
            <input
              matInput
              formControlName="endDate"
              [matDatepicker]="endDatePicker"
            />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle
              matSuffix
              [for]="endDatePicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #endDatePicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field class="course-fields">
            <mat-label>Course Fee</mat-label>
            <mat-icon matPrefix>currency_rupee</mat-icon>
            <input type="number" matInput formControlName="courseFee" />
            <mat-error *ngIf="course.get('courseFee')?.hasError('required')">
              Course Fee is required
            </mat-error>
          </mat-form-field>
        </div>
        <div *ngIf="isEditMode">
          <div class="add-course-container" formArrayName="payments">
            <h3 class="side-heading" align="left">
              <mat-icon class="side-heading-icon">tag</mat-icon>Payments
              Info<mat-icon class="side-heading-icon">arrow_right</mat-icon>
            </h3>
            <button
              mat-icon-button
              class="submit-button"
              (click)="addPayment()"
            >
              <mat-icon>add</mat-icon>
            </button>
          </div>
          <div
            style="overflow: auto; max-width: 800px; border-radius: 1em;"
            class="mat-elevation-z8"
            *ngIf="payments.length > 0; else noPaymentsMsg"
          >
            <table mat-table [dataSource]="paymentsDataSource">
              <!-- Course Selector Column -->
              <ng-container matColumnDef="course">
                <th mat-header-cell *matHeaderCellDef>Course</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  <mat-form-field
                    appearance="fill"
                    *ngIf="!payment.get('courseId')?.disabled; else courseLabel"
                  >
                    <mat-select
                      formControlName="courseId"
                      placeholder="Select Course"
                    >
                      <mat-option
                        *ngFor="let course of getFilteredCourseInfoArray()"
                        [value]="course.get('id')?.value"
                      >
                        <!-- {{ transformCourseId(course.get('id')?.value) }} -->
                        {{ transformCourseId(course.get('id')?.value) }}
                      </mat-option>
                      <mat-option value="annual_day"> Annual Day </mat-option>
                      <mat-option value="others">Others</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <ng-template #courseLabel>
                    <!-- {{ transformCourseId(payment.get('courseId')?.value) }} -->
                    {{ transformCourseId(payment.get('courseId')?.value) }}
                  </ng-template>
                </td>
              </ng-container>
              <ng-container matColumnDef="term">
                <th mat-header-cell *matHeaderCellDef>Term</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  <mat-form-field
                    appearance="fill"
                    *ngIf="!payment.get('courseId')?.disabled; else termLabel"
                  >
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
                  <ng-template #termLabel>
                    {{ getTerm(payment.get('term')?.value) }}
                  </ng-template>
                </td>
              </ng-container>
              <!-- Amount Input Column -->
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  <mat-form-field
                    appearance="fill"
                    *ngIf="!payment.get('amount')?.disabled; else amountLabel"
                  >
                    <input
                      matInput
                      type="number"
                      formControlName="amount"
                      placeholder="Enter Amount"
                    />
                  </mat-form-field>
                  <ng-template #amountLabel>
                    {{ payment.get('amount')?.value }}
                  </ng-template>
                </td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let payment" [formGroup]="payment">
                  <span *ngIf="payment.get('courseId')?.disabled">
                    {{
                      payment.get('date')?.value | date : 'MMM dd, YYYY hh:mm a'
                    }}
                  </span>
                </td>
              </ng-container>

              <!-- Delete Column -->
              <ng-container matColumnDef="delete">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let payment; let i = index">
                  <div
                    *ngIf="!payment.get('courseId')?.disabled; else actionIcon"
                  >
                    <button
                      mat-icon-button
                      color="warn"
                      (click)="removePayment(i)"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <ng-template #actionIcon>
                    <mat-icon style="color: green;">check_circle</mat-icon>
                  </ng-template>
                </td>
              </ng-container>

              <!-- Header and Row Definitions -->
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
            <div class="inner-button">
              <button
                mat-raised-button
                class="submit-button"
                (click)="saveNewPayments()"
                [hidden]="!hasNewPayments"
              >
                <mat-icon>save</mat-icon>Save Payment
              </button>
            </div>
          </div>
          <ng-template #noPaymentsMsg>
            <span>No payment Records..</span>
          </ng-template>
        </div>
        <h3 class="side-heading" align="left">
          <mat-icon class="side-heading-icon">tag</mat-icon>Referral
          Info<mat-icon class="side-heading-icon">arrow_right</mat-icon>
        </h3>
        <div class="row">
          <mat-form-field>
            <mat-label>Referred by</mat-label>
            <mat-select formControlName="referralType">
              <mat-option
                *ngFor="let type of referralTypeList()"
                [value]="type.key"
                >{{ type.value }}</mat-option
              >
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input matInput formControlName="referralName" />
          </mat-form-field>
        </div>
        <h3 class="side-heading" align="left">
          <mat-icon class="side-heading-icon">tag</mat-icon>Health Info<mat-icon
            class="side-heading-icon"
            >arrow_right</mat-icon
          >
        </h3>
        <div class="row">
          <mat-form-field>
            <mat-label>Pre-existing Conditions</mat-label>
            <mat-select formControlName="healthCondition" multiple>
              <mat-select-trigger>
                {{healthCondition?.value?.[0] || ''}}
                @if ((healthCondition?.value?.length || 0) > 1) {
                <span class="example-additional-selection">
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
                >{{ condition }}</mat-option
              >
            </mat-select>
            <mat-error *ngIf="healthCondition?.hasError('required')">
              Select relevant condition
            </mat-error>
          </mat-form-field>
        </div>
        <mat-form-field>
          <mat-label>Describe your condition</mat-label>
          <textarea
            matInput
            formControlName="healthConditionDesc"
            placeholder="Condition details(if any) ..."
          ></textarea>
        </mat-form-field>
        <div class="center margin-top">
          <button
            mat-flat-button
            class="submit-button"
            (click)="createOrUpdateCandidate()"
          >
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
  .row {
    display: grid;
    column-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  .side-heading-icon {
    height: 20px;
    width: 26px;
    font-size: 24px;
  }
  .side-heading {
    font-size: 3vh;
    font-weight: 100;
    padding: 1vh 0em;
  }
  .inner-button {
    margin: 1em;
    overflow-y: hidden;
    display: flex;
    justify-content: flex-end;
  }
  mat-divider {
    height: 1em;
  }
  .add-course-container {
    display: flex;
  align-items: center;
  justify-content: space-between;
  }
  .course-row {
    margin: 1em 0em;
    padding: 1em 1em 1em 1em;
    border-radius: 0em 1em 1em 0em;
    border-left: inset 3px;
    column-gap: 0em !important;
  }
  .course-fields {
    max-width: 80%;
  }
  ::ng-deep .mat-column-amount {
  max-width: 10em;
}
::ng-deep .mat-column-term {
  min-width:11em; 
}
::ng-deep .mat-column-date {
  min-width: 15em;
}
  `,
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
  // loadCandidateFormData(candidateData: Candidate) {
  //   this.newCandidateForm.setValue({
  //     firstName: candidateData.firstName || '',
  //     lastName: candidateData.lastName || '',
  //     email: candidateData.email || '',
  //     phone: candidateData.phone || '',
  //     dob:
  //       candidateData.dob instanceof Timestamp
  //         ? candidateData.dob.toDate()
  //         : candidateData.dob || '',
  //     gender: candidateData.gender || '',
  //     address: candidateData.address || '',
  //     courseInfo:
  //       candidateData.courseInfo?.map((info) => ({
  //         id: info.id,
  //         course: info.course || '',
  //         proficiency: info.proficiency || '',
  //         admissionDate:
  //           info.admissionDate instanceof Timestamp
  //             ? info.admissionDate.toDate()
  //             : info.admissionDate || '',
  //         endDate: info.endDate || '',
  //         courseFee: info.courseFee || 0,
  //         status: info.status || '',
  //       })) || [],
  //     payments:
  //       candidateData.payments?.map((pay) => ({
  //         id: pay.id,
  //         courseId: pay.courseId || '',
  //         amount: pay.amount || 0,
  //         date: pay.date || '',
  //       })) || [],
  //     referralType: candidateData.referralType || '',
  //     referralName: candidateData.referralName || '',
  //     healthCondition: candidateData.healthCondition || [],
  //     healthConditionDesc: candidateData.healthConditionDesc || '',
  //   });
  // }

  loadCandidateFormData(candidateData: Candidate) {
    // Clear existing form arrays to prevent mismatch issues
    const courseInfoArray = this.newCandidateForm.get(
      'courseInfo'
    ) as FormArray;
    const paymentsArray = this.newCandidateForm.get('payments') as FormArray;
    courseInfoArray.clear();
    paymentsArray.clear();

    // Populate courseInfo form array
    candidateData.courseInfo?.forEach((info) => {
      courseInfoArray.push(
        this.fb.group({
          id: [info.id],
          course: [info.course || ''],
          proficiency: [info.proficiency || ''],
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

    // Populate payments form array
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
    // Disable form controls for existing payments
    paymentsArray.controls.forEach((control) => {
      if (control.get('isReadOnly')?.value) {
        control.get('courseId')?.disable();
        control.get('amount')?.disable();
      }
    });
    this.paymentsDataSource = [...this.payments.controls];
    // Set the form values
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
  // courseInfo = (this.newCandidateForm.get('courseInfo') as FormArray).at(
  //   0
  // ) as FormGroup;
  // course = this.courseInfo.get('course');
  // proficiency = this.courseInfo.get('proficiency');
  // admissionDate = this.courseInfo.get('admissionDate');
  // courseFee = this.courseInfo.get('courseFee');
  healthCondition = this.newCandidateForm.get('healthCondition');
  today: any = new Date();

  async createOrUpdateCandidate() {
    this.newCandidateForm.markAllAsTouched();
    let { email, courseInfo, payments, ...data } = this.newCandidateForm.value;
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
      await this.candidateService.addOrUpdateCandidate(
        {
          email,
          courseInfo,
          payments,
          ...data,
        },
        this.isEditMode
      );
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
        courseId: ['', Validators.required], // Dropdown to select existing course ID
        term: ['', Validators.required],
        amount: [0, Validators.required],
        date: [new Date().toISOString(), Validators.required], // Defaults to current date
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
    // Filter payments without the 'readOnly' flag
    const newPayments = this.payments.controls
      .filter((payment) => !payment.get('isReadOnly')?.value)
      .map((payment) => payment.value); // Extract the value as plain data

    // Save each new payment
    try {
      this.notificationService.showLoading();
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
}
