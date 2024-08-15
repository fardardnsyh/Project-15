import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  open(
    message: string,
    action: string = 'Close',
    duration: number = 2000
  ): void {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }

  openIndefinite(
    message: string,
    action: string = 'Close'
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action);
  }
}
