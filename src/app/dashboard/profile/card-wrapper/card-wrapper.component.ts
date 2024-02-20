import { Component, Input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-wrapper',
  standalone: true,
  imports: [CardModule],
  templateUrl: './card-wrapper.component.html',
})
export class CardWrapperComponent {
  @Input({ required: true }) title!: string;
  @Input() icon!: string;
}
