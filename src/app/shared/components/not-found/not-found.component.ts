import { Component } from '@angular/core';

import { GoBackButtonComponent } from '../go-back-button/go-back-button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [GoBackButtonComponent],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
