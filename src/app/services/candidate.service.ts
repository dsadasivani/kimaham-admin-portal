import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
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

  addOrUpdateCandidate(
    candidate: Candidate,
    mergeFlag: boolean
  ): Promise<void> {
    const ref = doc(this.firestore, 'candidates', candidate.email);
    return setDoc(ref, candidate, { merge: mergeFlag });
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

  async getCandidateById(candidateId: string): Promise<Candidate | undefined> {
    const candidateRef = doc(this.firestore, 'candidates', candidateId);
    const querySnapshot = await getDoc(candidateRef);
    if (querySnapshot.exists()) {
      return {
        email: querySnapshot.id,
        ...querySnapshot.data(),
      } as Candidate;
    } else {
      console.log('No such candidate found!');
      return undefined;
    }
  }
}
