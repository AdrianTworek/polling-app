import { Component } from '@angular/core';

import { ProfileHeaderComponent } from './profile-header/profile-header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileHeaderComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {}
