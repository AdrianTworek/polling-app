import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';

import { PollsService } from '../polls.service';
import { AuthService } from '../../../auth/auth.service';
import { PollType } from '../../../shared/types';

export const anonymousPollGuard: CanActivateFn = (route, state) => {
  const pollId = route.paramMap.get('pollId') as string;
  const pollService = inject(PollsService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser$ = toObservable(authService.currentUser);
  const authInitialized$ = toObservable(authService.authInitialized);

  return authInitialized$.pipe(
    filter((initialized) => !!initialized),
    switchMap(() =>
      currentUser$.pipe(
        switchMap((user) =>
          pollService.getPollById(pollId).pipe(
            map((poll) => {
              if (!poll) {
                return false;
              }

              if (poll.type === PollType.Public) {
                return true;
              }

              return (
                poll.type === PollType.Anonymous && poll.createdBy === user?.uid
              );
            }),
            tap((isAuthorized) => {
              if (!isAuthorized) {
                router.navigate(['/not-found']);
              }
            }),
          ),
        ),
      ),
    ),
  );
};
