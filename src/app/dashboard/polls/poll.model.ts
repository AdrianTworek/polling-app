import { Timestamp } from '@angular/fire/firestore';

import { PollType } from '../../shared/types';

export interface Poll {
  id: string;
  title: string;
  multipleChoicesAllowed: boolean;
  createdBy: string;
  createdAt: Timestamp;
  type: PollType;
  options: PollOption;
}

export interface PollOption {
  value: string;
  votes: number;
}
