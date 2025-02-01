import { Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-card-wrapper',
    imports: [CardModule],
    templateUrl: './card-wrapper.component.html'
})
export class CardWrapperComponent {
  title = input.required<string>();
  icon = input<string>();
}
