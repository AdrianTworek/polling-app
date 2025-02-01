import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

export interface ObsWithStatusResult<T> {
  isLoading?: boolean;
  value?: T | null;
  error?: string | null;
}

const defaultError = 'Something went wrong';

@Pipe({
  name: 'obsWithStatus',
  standalone: true,
})
export class ObsWithStatusPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform<T = any>(val: Observable<T>): Observable<ObsWithStatusResult<T>> {
    return val.pipe(
      map((value: T) => {
        return {
          isLoading: false,
          value,
          error: null,
        };
      }),
      startWith({ isLoading: true, value: null, error: null }),
      catchError((error) => {
        return of({
          isLoading: false,
          value: null,
          error: typeof error === 'string' ? error : defaultError,
        });
      }),
    );
  }
}
