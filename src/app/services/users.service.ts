import { inject, Injectable, Signal } from '@angular/core';
import { AuthService } from './auth.service';
import {
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ProfileUser } from '../models/user';
import { User } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  storage = inject(Storage);

  private currentUserProfile$ = this.authService.currentUser$.pipe(
    switchMap((user: User) => {
      if (!user) {
        return of(null);
      }
      const ref = doc(this.firestore, 'users', user?.uid);
      return docData(ref) as Observable<ProfileUser>;
    })
  );
  currentUserProfile: Signal<ProfileUser | null | undefined> = toSignal(
    this.currentUserProfile$
  );

  addUser(user: ProfileUser): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return setDoc(ref, user);
  }

  updateUser(user: ProfileUser) {
    const ref = doc(this.firestore, 'users', user.uid);
    return updateDoc(ref, { ...user });
  }
  async uploadProfilePhoto(image: File, path: string): Promise<String> {
    const storageRef = ref(this.storage, path);
    const result = await uploadBytes(storageRef, image);
    return await getDownloadURL(result.ref);
  }
  async checkUserExists(uid: string): Promise<boolean> {
    try {
      const ref = doc(this.firestore, 'users', uid);
      const docSnap = await getDoc(ref);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }
}
