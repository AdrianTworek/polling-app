import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'polls', pathMatch: 'full' },
  {
    path: 'polls',
    loadComponent: () =>
      import('./polls/polls.component').then((c) => c.PollsComponent),
  },
  {
    path: 'polls/new',
    loadComponent: () =>
      import('./polls/poll-creator/poll-creator.component').then(
        (c) => c.PollCreatorComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((c) => c.ProfileComponent),
  },
];
