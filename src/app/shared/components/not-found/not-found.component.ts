import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private location = inject(Location);

  onGoBack() {
    this.location.back();
  }
}
