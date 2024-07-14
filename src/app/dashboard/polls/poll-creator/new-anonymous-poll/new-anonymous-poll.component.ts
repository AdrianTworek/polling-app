import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { PollsService } from '../../polls.service';
import { PollType } from '../../../../shared/types';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-new-anonymous-poll',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './new-anonymous-poll.component.html',
})
export class NewAnonymousPollComponent {
  private fb = inject(FormBuilder);
  private pollsService = inject(PollsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  isLoading = signal(false);

  pollForm = this.fb.nonNullable.group({
    title: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    ],
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
      option: [value, [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.pollForm.valid) {
      this.isLoading.set(true);

      this.pollsService
        .createPoll({
          title: this.title.value,
          options: this.options.value.map(
            (option: { option: string }) => option.option
          ),
          type: PollType.Anonymous,
          createdAt: Timestamp.now(),
        })
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'You have successfully created a poll',
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
    }
  }
}