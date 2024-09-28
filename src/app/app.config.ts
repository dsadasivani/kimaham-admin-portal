import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideNativeDateAdapter } from '@angular/material/core';

const firebaseConfig = {
  apiKey: 'AIzaSyDG2WfzJpoqh6SdktzPLfwX1uqpPe-AcTQ',
  authDomain: 'kimaham-app.firebaseapp.com',
  projectId: 'kimaham-app',
  storageBucket: 'kimaham-app.appspot.com',
  messagingSenderId: '914103395350',
  appId: '1:914103395350:web:8261d51bcf183161a7c137',
  measurementId: 'G-92MP8Q6T93',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
