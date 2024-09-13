import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { PollsComponent } from './dashboard/polls/polls.component';
import { PollCreatorComponent } from './dashboard/polls/poll-creator/poll-creator.component';
import { PollVoteComponent } from './dashboard/polls/poll-vote/poll-vote.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { PollDetailsComponent } from './dashboard/polls/poll-details/poll-details.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    ...canActivate(redirectLoggedInToDashboard),
  },
  {
    path: 'polls/:pollId/vote',
    component: PollVoteComponent,
  },
  {
    path: 'polls/:pollId',
    component: PollDetailsComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      { path: '', redirectTo: 'polls', pathMatch: 'full' },
      { path: 'polls', component: PollsComponent },
      { path: 'polls/new', component: PollCreatorComponent },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
