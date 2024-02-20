import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule],
  templateUrl: './profile-header.component.html',
})
export class ProfileHeaderComponent {
  authService = inject(AuthService);
}
