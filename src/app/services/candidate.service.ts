import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Candidate } from '../models/candidate';
import { CandidatePayment } from '../models/candidate-payment';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  firestore = inject(Firestore);

  addOrUpdateCandidate(candidate: any, mergeFlag: boolean): Promise<void> {
    const ref = doc(this.firestore, 'candidates', candidate.email);
    return setDoc(ref, candidate, { merge: mergeFlag });
  }
  // addPayments(
  //   candidateId: string,
  //   payments: CandidatePayment[]
  // ): Promise<void[]> {
  //   const paymentPromises = payments.map((payment) => {
  //     const paymentRef = doc(
  //       this.firestore,
  //       `candidates/${candidateId}/payments/${payment.id}`
  //     );
  //     return setDoc(paymentRef, payment);
  //   });
  //   return Promise.all(paymentPromises);
  // }
  addNewPayments(
    candidateId: string,
    newPayments: CandidatePayment[]
  ): Promise<void> {
    const candidateDocRef = doc(this.firestore, `candidates/${candidateId}`);

    return getDoc(candidateDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const existingData = docSnapshot.data() as Candidate;
          const updatedPayments = [
            ...(existingData.payments || []),
            ...newPayments,
          ];

          return updateDoc(candidateDocRef, { payments: updatedPayments })
            .then(() => console.log('New payments added successfully'))
            .catch((error) =>
              console.error('Error updating payments: ', error)
            );
        } else {
          return Promise.reject('Candidate document not found');
        }
      })
      .catch((error) => {
        console.error('Error retrieving candidate document: ', error);
        throw error;
      });
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
