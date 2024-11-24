import { Timestamp } from 'firebase/firestore';
import { CandidatePayment } from './candidate-payment';
import { CourseInfo } from './course-info';

export interface Candidate {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  dob?: any;
  gender?: string;
  address?: string;
  courseInfo?: CourseInfo[];
  payments?: CandidatePayment[];
  referralType?: string;
  referralName?: string;
  healthCondition?: string[];
  healthConditionDesc?: string;
  createdBy?: string;
  createdOn?: any;
  updatedBy?: string;
  updatedOn?: string;
}
