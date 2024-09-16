import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

import { anonymousPollGuard } from './dashboard/polls/guards/anonymous-poll.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
    ...canActivate(redirectLoggedInToDashboard),
  },
  {
    path: 'polls/:pollId/vote',
    loadComponent: () =>
      import('./dashboard/polls/poll-vote/poll-vote.component').then(
        (c) => c.PollVoteComponent,
      ),
  },
  {
    path: 'polls/:pollId',
    loadComponent: () =>
      import('./dashboard/polls/poll-details/poll-details.component').then(
        (c) => c.PollDetailsComponent,
      ),
    canActivate: [anonymousPollGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent,
      ),
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
