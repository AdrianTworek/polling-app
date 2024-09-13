import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDocs,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import {
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { Poll, PollCreate, SelectedOption } from './poll.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PollsService {
  private authService = inject(AuthService);
  private db = inject(Firestore);
  private pollsCollection = collection(this.db, 'polls');
  private usersCollection = collection(this.db, 'users');

  getUserPolls(): Observable<Poll[]> {
    const userPollsQuery = query(
      this.pollsCollection,
      where('createdBy', '==', this.authService.currentUser()?.uid),
      orderBy('createdAt', 'desc'),
    );
    return collectionData(userPollsQuery, { idField: 'id' }) as Observable<
      Poll[]
    >;
  }

  createPoll(poll: PollCreate) {
    const promise = addDoc(this.pollsCollection, {
      ...poll,
      createdBy: this.authService.currentUser()?.uid,
      createdAt: Timestamp.now(),
      votedBy: [],
    }).then((response) => response.id);
    return from(promise);
  }

  getPollById(id: string): Observable<Poll | undefined> {
    const pollRef = doc(this.db, 'polls', id);
    return docData(pollRef, { idField: 'id' }) as Observable<Poll | undefined>;
  }

  getPollWithAuthor(id: string) {
    return this.getPollById(id).pipe(
      switchMap((poll) => {
        if (!poll) {
          return of(null);
        }

        const authorId = poll.createdBy;
        const authorQuery = query(
          this.usersCollection,
          where('uid', '==', authorId),
        );

        const poll$ = of(poll);
        const author$ = from(getDocs(authorQuery)).pipe(
          switchMap((snapshot) => {
            if (!snapshot.empty) {
              const author = snapshot.docs[0];
              const authorData = author.data();
              return of({
                id: author.id,
                uid: authorData['uid'] as string,
                name: authorData['name'] as string,
                photoUrl: authorData['photoUrl'] as string,
              });
            }
            return of(null);
          }),
          catchError(() => of(null)),
        );

        return combineLatest([poll$, author$]).pipe(
          map(([pollData, authorData]) => {
            return {
              ...pollData,
              author: authorData,
            };
          }),
        );
      }),
    );
  }

  vote(pollId: string, selectedOptions: SelectedOption[]) {
    const userId = this.authService.currentUser()?.uid;
    const pollRef = doc(this.db, 'polls', pollId);

    const promise = runTransaction(this.db, async (tx) => {
      const pollDoc = await tx.get(pollRef);

      if (!pollDoc.exists()) {
        throw new Error('Poll not found');
      }

      const poll = pollDoc.data() as Poll;

      if (poll.createdBy === userId) {
        throw new Error('You cannot vote on your own poll');
      }

      if (userId && poll.votedBy.includes(userId)) {
        throw new Error('You have already voted on this poll');
      }

      const updatedOptions = poll.options.map((option, idx) => {
        if (poll.multipleChoicesAllowed) {
          return {
            ...option,
            votes: option.votes + (selectedOptions[idx] ? 1 : 0),
          };
        } else {
          return {
            ...option,
            votes:
              option.value === selectedOptions[0]
                ? option.votes + 1
                : option.votes,
          };
        }
      });

      tx.update(pollRef, {
        options: updatedOptions,
        votedBy: [...poll.votedBy, userId],
      });
    });

    return from(promise);
  }
}
