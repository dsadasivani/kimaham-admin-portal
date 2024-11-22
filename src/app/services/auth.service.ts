import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  currentUser$ = authState(this.firebaseAuth);
  currentUser = toSignal(this.currentUser$);

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }
  logout(): Promise<void> {
    return signOut(this.firebaseAuth);
  }
  setDisplayName(user: User, name: string): Promise<void> {
    return updateProfile(user, { displayName: name });
  }
  getUserInfo(uid: string) {
    return;
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }
}
