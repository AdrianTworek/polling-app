import { Timestamp } from '@angular/fire/firestore';

import { PollType } from '../../shared/types';

export interface Poll {
  id: string;
  title: string;
  multipleChoicesAllowed: boolean;
  createdBy: string;
  createdAt: Timestamp;
  type: PollType;
  options: PollOption[];
  votedBy: string[];
}

export interface PollCreate {
  title: string;
  multipleChoicesAllowed: boolean;
  options: PollOption[];
  type: PollType;
}

export interface PollOption {
  value: string;
  votes: number;
}

export type SelectedOption = boolean | string;
