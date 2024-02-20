import { Component } from '@angular/core';

import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { CardWrapperComponent } from './card-wrapper/card-wrapper.component';
import { UsernameFormComponent } from './username-form/username-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    CardWrapperComponent,
    UsernameFormComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {}
