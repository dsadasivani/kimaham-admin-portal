import { Timestamp } from 'firebase/firestore';
import { CandidatePayment } from './candidate-payment';
import { CourseInfo } from './course-info';

export interface Candidate {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: number;
  dob?: Date;
  gender?: string;
  address?: string;
  courseInfo?: CourseInfo[];
  payments?: CandidatePayment[];
  referralType?: string;
  referralName?: string;
  healthCondition?: string[];
  healthConditionDesc?: string;
}
