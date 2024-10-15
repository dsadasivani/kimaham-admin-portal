import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { Candidate } from '../models/candidate';
import { CandidatePayment } from '../models/candidate-payment';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  firestore = inject(Firestore);

  addCandidate(candidate: Candidate): Promise<void> {
    const ref = doc(this.firestore, 'candidates', candidate.email);
    return setDoc(ref, candidate);
  }
  addPayment(candidateId: string, payment: CandidatePayment): Promise<void> {
    const paymentRef = doc(
      this.firestore,
      `candidates/${candidateId}/payments`,
      payment.id
    );
    return setDoc(paymentRef, payment);
  }
  async getAllCandidates(): Promise<Candidate[]> {
    const candidatesRef = collection(this.firestore, 'candidates');
    const querySnapshot = await getDocs(candidatesRef);
    const candidates: Candidate[] = querySnapshot.docs.map((doc) => ({
      email: doc.id,
      ...doc.data(),
    })) as Candidate[];

    return candidates;
  }
}
