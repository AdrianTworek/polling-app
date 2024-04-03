import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-poll-card',
  standalone: true,
  imports: [CardModule, DialogModule],
  templateUrl: './create-poll-card.component.html',
})
export class CreatePollCardComponent {
  visible = false;

  showDialog() {
    this.visible = true;
  }
}
