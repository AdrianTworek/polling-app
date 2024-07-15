import { Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-wrapper',
  standalone: true,
  imports: [CardModule],
  templateUrl: './card-wrapper.component.html',
})
export class CardWrapperComponent {
  title = input.required<string>();
  icon = input<string>();
}
