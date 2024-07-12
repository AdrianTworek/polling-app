import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  Auth,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  deleteUser,
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

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
    });
  }

  private async signUpWithProvider(
    provider: AuthProvider,
    providerName: string
  ) {
    return signInWithPopup(this.auth, provider)
      .then((result) => this.storeUserInDatabaseHandler(result, providerName))
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  private async storeUserInDatabaseHandler(
    result: UserCredential,
    providerName: string
  ) {
    const user = result.user;

    const q = query(collection(this.db, 'users'), where('uid', '==', user.uid));
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
  }

  async signUpWithGoogle() {
    const googleProvider = new GoogleAuthProvider();
    return this.signUpWithProvider(googleProvider, 'google');
  }

  async signUpWithGithub() {
    const githubProvider = new GithubAuthProvider();
    return this.signUpWithProvider(githubProvider, 'github');
  }

  async registerWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => this.storeUserInDatabaseHandler(result, 'email'))
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => Promise.resolve(result))
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  logOut() {
    return signOut(this.auth);
  }

  updateUsername(username: string): Observable<any> {
    const promise = updateProfile(this.auth.currentUser!, {
      displayName: username,
    });
    return from(promise);
  }

  deleteAccount(): Observable<any> {
    const promise = deleteUser(this.auth.currentUser!);
    return from(promise);
  }
}
