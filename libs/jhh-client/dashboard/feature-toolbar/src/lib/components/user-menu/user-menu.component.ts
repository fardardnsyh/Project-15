import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { User } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  @ViewChild('removeAccountDialogContent')
  private readonly removeAccountDialogContent: TemplateRef<any>;

  removeAccountInProgress$: Observable<boolean>;
  removeAccountError$: Observable<string | null>;
  user$: Observable<User | null>;

  dialogRef: MatDialogRef<TemplateRef<any>>;
  removeAccountConfirmationText: string = '';
  readonly expectedRemoveAccountConfirmationTexts: string[] = [
    'remove account',
    '"remove account"',
    `'remove account'`,
  ];

  ngOnInit(): void {
    this.removeAccountInProgress$ = this.authFacade.removeAccountInProgress$;
    this.removeAccountError$ = this.authFacade.removeAccountError$;
    this.user$ = this.authFacade.user$;
  }

  handleLogout(): void {
    this.authFacade.logout();
  }

  openRemoveAccountDialog(): void {
    this.dialogRef = this.dialog.open(this.removeAccountDialogContent);
    this.dialogRef?.afterClosed().subscribe(() => {
      this.removeAccountConfirmationText = '';
    });
  }

  trySubmitRemoveAccount(inProgress: string): void {
    if (inProgress !== 'false') {
      return;
    }

    this.handleRemoveAccount();
  }

  handleRemoveAccount(): void {
    if (this.isRemoveConfirmationValid()) {
      this.authFacade.removeAccount();
    }
  }

  isRemoveConfirmationValid(): boolean {
    return this.expectedRemoveAccountConfirmationTexts.includes(
      this.removeAccountConfirmationText.toLowerCase()
    );
  }
}
