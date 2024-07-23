import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';

import { PollsService } from '../../polls.service';
import { PollType } from '../../../../shared/types';
import { CustomValidators } from '../../../../shared/validators';

@Component({
  selector: 'app-new-public-poll',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule],
  templateUrl: './new-public-poll.component.html',
})
export class NewPublicPollComponent {
  private fb = inject(FormBuilder);
  private pollsService = inject(PollsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);

  pollForm = this.fb.nonNullable.group({
    title: [
      '',
      [
        CustomValidators.requiredTrimmed,
        Validators.minLength(3),
        Validators.maxLength(255),
      ],
    ],
    multipleChoicesAllowed: [false],
    options: this.fb.nonNullable.array<FormGroup>(
      [this.createOption('Option 1'), this.createOption('Option 2')],
      Validators.minLength(2)
    ),
  });

  get title() {
    return this.pollForm.controls.title;
  }

  get options() {
    return this.pollForm.controls.options as FormArray;
  }

  addOption() {
    this.options.push(this.createOption(`Option ${this.options.length + 1}`));
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  private createOption(value = ''): FormGroup {
    return this.fb.nonNullable.group({
      option: [
        value,
        [CustomValidators.requiredTrimmed, Validators.maxLength(100)],
      ],
    });
  }

  onSubmit() {
    if (this.pollForm.valid) {
      this.isLoading.set(true);

      const subscription = this.pollsService
        .createPoll({
          title: this.title.value,
          multipleChoicesAllowed:
            this.pollForm.controls.multipleChoicesAllowed.value,
          options: this.options.value.map((option: { option: string }) => ({
            value: option.option,
            votes: 0,
          })),
          type: PollType.Public,
          createdAt: Timestamp.now(),
        })
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'You have successfully created a public poll',
            });
            this.router.navigate(['../'], {
              relativeTo: this.route,
            });
          },
          error: (err) => {
            this.isLoading.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Something went wrong',
              detail: err,
            });
          },
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
