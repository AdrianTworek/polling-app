import { Component } from '@angular/core';

import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { CardWrapperComponent } from '../../shared/components/card-wrapper/card-wrapper.component';
import { UsernameFormComponent } from './username-form/username-form.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';

@Component({
    selector: 'app-profile',
    imports: [
        ProfileHeaderComponent,
        CardWrapperComponent,
        UsernameFormComponent,
        DeleteProfileComponent,
    ],
    templateUrl: './profile.component.html'
})
export class ProfileComponent {}
