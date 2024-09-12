import {
  Component,
  inject,
  input,
  signal,
  DestroyRef,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { PollsService } from '../polls.service';
import { AuthService } from '../../../auth/auth.service';
import { Poll } from '../poll.model';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { CardWrapperComponent } from '../../../shared/components/card-wrapper/card-wrapper.component';
import { CustomValidators } from '../../../shared/validators';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-poll-vote',
  standalone: true,
  imports: [
    AsyncPipe,
    NotFoundComponent,
    ProgressSpinnerModule,
    CardWrapperComponent,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  templateUrl: './poll-vote.component.html',
})
export class PollVoteComponent {
  pollId = input.required<string>();

  private authService = inject(AuthService);
  private pollsService = inject(PollsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  user = computed(() => this.authService.currentUser());

  voteForm = this.fb.group({
    selectedOptions: this.fb.array([], CustomValidators.minSelectedOptions(1)),
  });

  poll$ = toObservable(this.pollId).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap((id) =>
      this.pollsService.getPollById(id).pipe(
        catchError(() => of(null)),
        tap((poll) => {
          if (poll) {
            this.setupForm(poll);
          }
          this.isLoading.set(false);
        })
      )
    )
  );

  get selectedOptions() {
    return this.voteForm.controls.selectedOptions as FormArray<FormControl>;
  }

  private setupForm(poll: Poll) {
    this.selectedOptions.clear();

    if (poll.multipleChoicesAllowed) {
      poll.options.forEach(() =>
        this.selectedOptions.push(this.fb.control(false))
      );
    } else {
      this.selectedOptions.push(this.fb.control(null, Validators.required));
    }

    this.voteForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.voteForm.valid) {
      this.pollsService
        .vote(this.pollId(), this.selectedOptions.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Vote successfully submitted',
            });
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: err.message,
            });
          },
        });
    }
  }
}
