import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-go-back-button',
    imports: [ButtonModule],
    templateUrl: './go-back-button.component.html'
})
export class GoBackButtonComponent {
  private location = inject(Location);

  onGoBack() {
    this.location.back();
  }
}
