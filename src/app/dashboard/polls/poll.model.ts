import { Timestamp } from '@angular/fire/firestore';

import { PollType } from '../../shared/types';

export interface Poll {
  id: string;
  title: string;
  createdBy: string;
  createdAt: Timestamp;
  type: PollType;
  options: string[];
}