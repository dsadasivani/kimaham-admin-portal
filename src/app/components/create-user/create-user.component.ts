import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
  ],
  template: `
    <div class="card text-center" matRipple [matRippleRadius]="20">
      <h2 class="heading" align="center">
        {{ isEditMode ? 'Candidate Details' : 'Candidate On-boarding' }}
      </h2>
      <mat-divider></mat-divider>
      <form
        [formGroup]="newCandidateForm"
        (ngSubmit)="createOrUpdateCandidate()"
      >
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
        <h3 class="side-heading" align="left">
          <mat-icon class="side-heading-icon">tag</mat-icon>Course Info<mat-icon
            class="side-heading-icon"
            >arrow_right</mat-icon
          >
        </h3>
        <div class="row" [formGroup]="courseInfo">
          <mat-form-field>
            <mat-label>Course</mat-label>
            <mat-select formControlName="course">
              <mat-option
                *ngFor="let course of coursesList()"
                [value]="course.key"
                >{{ course.value }}</mat-option
              >
            </mat-select>
            <mat-error *ngIf="course?.hasError('required')">
              Select valid course
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Proficiency</mat-label>
            <mat-select formControlName="proficiency">
              <mat-option
                *ngFor="let proficiency of proficiencyList()"
                [value]="proficiency.key"
                >{{ proficiency.value }}</mat-option
              >
            </mat-select>
            <mat-error *ngIf="proficiency?.hasError('required')">
              Please select proficiency
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Date of Admission</mat-label>
            <input
              matInput
              formControlName="admissionDate"
              [matDatepicker]="picker"
            />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="admissionDate?.hasError('required')">
              Admission Date is required
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-label>End Date</mat-label>
            <input
              matInput
              formControlName="endDate"
              [matDatepicker]="endDatePicker"
            />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle
              matIconSuffix
              [for]="endDatePicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #endDatePicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Course Fee</mat-label>
            <mat-icon matPrefix>currency_rupee</mat-icon>
            <input type="number" matInput formControlName="courseFee" />
            <mat-error *ngIf="courseFee?.hasError('required')">
              Course Fee is required
            </mat-error>
          </mat-form-field>
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
          <button mat-flat-button class="submit-button">
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
  mat-divider {
    height: 1em;
  }
  `,
})
export class CreateUserComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  candidateService = inject(CandidateService);
  notificationService = inject(NotificationService);
  routerService = inject(Router);
  route = inject(ActivatedRoute);
  isEditMode = false;
  candidateId: string | null = null;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.candidateId = params.get('id');
      this.isEditMode = !!this.candidateId;
      if (this.isEditMode) {
        this.loadCandidateData();
      }
    });
  }

  async loadCandidateData() {
    if (!this.candidateId) return;

    try {
      this.notificationService.showLoading();
      const candidateData = await this.candidateService.getCandidateById(
        this.candidateId
      );
      if (!candidateData) {
        return;
      }
      this.loadCandidateFormData(candidateData);
      this.notificationService.hideLoading();
    } catch (error) {
      this.notificationService.error('Error loading candidate data');
    }
  }
  loadCandidateFormData(candidateData: Candidate) {
    this.newCandidateForm.setValue({
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
      courseInfo:
        candidateData.courseInfo?.map((info) => ({
          course: info.course || '',
          proficiency: info.proficiency || '',
          admissionDate:
            info.admissionDate instanceof Timestamp
              ? info.admissionDate.toDate()
              : info.admissionDate || '',
          endDate: info.endDate || '',
          courseFee: info.courseFee || 0,
          status: info.status || '',
        })) || [],
      payments: candidateData.payments || [],
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
  courseInfo = (this.newCandidateForm.get('courseInfo') as FormArray).at(
    0
  ) as FormGroup;
  course = this.courseInfo.get('course');
  proficiency = this.courseInfo.get('proficiency');
  admissionDate = this.courseInfo.get('admissionDate');
  courseFee = this.courseInfo.get('courseFee');
  healthCondition = this.newCandidateForm.get('healthCondition');
  today: any = new Date();

  async createOrUpdateCandidate() {
    this.newCandidateForm.markAllAsTouched();
    const { email, courseInfo, ...data } = this.newCandidateForm.value;
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
      this.notificationService.showLoading();
      await this.candidateService.addOrUpdateCandidate(
        {
          email,
          courseInfo,
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
      }
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }
  getAge(): string {
    return calculateAge(this.newCandidateForm.get('dob')?.value);
  }
}
