import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Auth,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Firestore);

  currentUserSig = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUserSig());

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSig.set(user);
    });
  }

  private async signUpWithProvider(
    provider: AuthProvider,
    providerName: string
  ) {
    return signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;

        this.currentUserSig.set(user);

        const q = query(
          collection(this.db, 'users'),
          where('uid', '==', user.uid)
        );
        const docs = await getDocs(q);

        if (docs.docs.length === 0) {
          await addDoc(collection(this.db, 'users'), {
            uid: user.uid,
            name: user.displayName,
            authProvider: providerName,
            email: user.email,
            photoUrl: user.photoURL,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.currentUserSig.set(null);
        return Promise.reject(error);
      });
  }

  async signUpWithGoogle() {
    const googleProvider = new GoogleAuthProvider();
    return this.signUpWithProvider(googleProvider, 'google');
  }

  async signUpWithGithub() {
    const githubProvider = new GithubAuthProvider();
    return this.signUpWithProvider(githubProvider, 'github');
  }

  logOut() {
    return signOut(this.auth);
  }
}
