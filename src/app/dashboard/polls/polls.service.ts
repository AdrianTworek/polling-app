import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

import { Poll } from './poll.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PollsService {
  private authService = inject(AuthService);
  private db = inject(Firestore);
  private pollsCollection = collection(this.db, 'polls');

  getUserPolls(): Observable<Poll[]> {
    const userPollsQuery = query(
      this.pollsCollection,
      where('createdBy', '==', this.authService.currentUser()?.uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(userPollsQuery, { idField: 'id' }) as Observable<
      Poll[]
    >;
  }

  createPoll(poll: Omit<Poll, 'id' | 'createdBy'>) {
    const promise = addDoc(this.pollsCollection, {
      ...poll,
      createdBy: this.authService.currentUser()?.uid,
    }).then((response) => response.id);
    return from(promise);
  }
}
