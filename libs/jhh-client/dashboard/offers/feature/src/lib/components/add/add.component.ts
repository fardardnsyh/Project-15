import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, filter, map, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { regex } from '@jhh/shared/regex';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { EnumValidator } from '@jhh/jhh-client/shared/util-enum-validator';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

import {
  Offer,
  OfferCompanyType,
  OfferFieldLength,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';
import {
  OfferField,
  OfferFormErrorKey,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Component({
  selector: 'jhh-offers-add',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    WhitespaceSanitizerDirective,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  readonly formField: typeof OfferField = OfferField;
  readonly fieldLength: typeof OfferFieldLength = OfferFieldLength;
  readonly formErrorKey: typeof OfferFormErrorKey = OfferFormErrorKey;
  readonly offerLocation: OfferLocation[] = Object.values(OfferLocation);
  readonly offerCompanyType: OfferCompanyType[] =
    Object.values(OfferCompanyType);
  readonly offerSalaryCurrency: OfferSalaryCurrency[] =
    Object.values(OfferSalaryCurrency);
  readonly offerStatus: OfferStatus[] = Object.values(OfferStatus);
  readonly offerPriority: OfferPriority[] = Object.values(OfferPriority);

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  addOfferInProgress$: Observable<boolean>;
  addOfferError$: Observable<string | null>;
  addOfferSuccess$: Observable<boolean>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.addOfferInProgress$ = this.offersFacade.addOfferInProgress$;
    this.addOfferError$ = this.offersFacade.addOfferError$;
    this.addOfferSuccess$ = this.offersFacade.addOfferSuccess$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.initFormGroup();
    this.handleReset();
    this.toggleCurrencyField();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.offersFacade.resetErrors();
      this.clearForm();
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      type FormData = Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;
      const formData: FormData = { ...this.formGroup.value };
      const {
        position,
        link,
        company,
        companyType,
        location,
        status,
        priority,
        minSalary,
        maxSalary,
        email,
        salaryCurrency,
        description,
      } = formData;
      const salaryCurrencyValue: OfferSalaryCurrency | undefined =
        salaryCurrency !== undefined ? salaryCurrency : undefined;

      this.offersFacade.addOffer(
        position,
        link,
        company,
        companyType,
        location,
        status,
        priority,
        minSalary,
        maxSalary,
        salaryCurrencyValue,
        email,
        description
      );
    }
  }

  private toggleCurrencyField(): void {
    this.formGroup.valueChanges
      .pipe(
        map((val) => ({
          minSalary: val.minSalary,
          maxSalary: val.maxSalary,
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.minSalary === curr.minSalary &&
            prev.maxSalary === curr.maxSalary
        ),
        tap(({ minSalary, maxSalary }) => {
          if (
            minSalary >= this.fieldLength.MinSalaryValue ||
            maxSalary >= this.fieldLength.MinSalaryValue
          ) {
            this.formGroup.get(this.formField.SalaryCurrency)!.enable();
          } else {
            this.formGroup.get(this.formField.SalaryCurrency)!.disable();
          }
        })
      )
      .subscribe();
  }

  private handleReset(): void {
    this.addOfferSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.dialogRef?.close();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private clearForm(): void {
    this.formGroup?.reset({
      [this.formField.CompanyType]: OfferCompanyType.SoftwareHouse,
      [this.formField.Location]: OfferLocation.Remote,
      [this.formField.Status]: OfferStatus.Applied,
      [this.formField.Priority]: OfferPriority.Medium,
      [this.formField.SalaryCurrency]: OfferSalaryCurrency.PLN,
    });
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Position]: [
        '',
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinPositionLength),
          Validators.maxLength(this.fieldLength.MaxPositionLength),
        ],
      ],
      [this.formField.Link]: [
        '',
        [
          Validators.required,
          Validators.pattern(regex.link),
          Validators.maxLength(this.fieldLength.MaxLinkLength),
        ],
      ],
      [this.formField.Company]: [
        '',
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinCompanyLength),
          Validators.maxLength(this.fieldLength.MaxCompanyLength),
        ],
      ],
      [this.formField.CompanyType]: [
        OfferCompanyType.SoftwareHouse,
        [Validators.required, EnumValidator(OfferCompanyType)],
      ],
      [this.formField.Location]: [
        OfferLocation.Remote,
        [Validators.required, EnumValidator(OfferLocation)],
      ],
      [this.formField.Status]: [
        OfferStatus.Applied,
        [Validators.required, EnumValidator(OfferStatus)],
      ],
      [this.formField.Priority]: [
        OfferPriority.Medium,
        [Validators.required, EnumValidator(OfferPriority)],
      ],
      [this.formField.MinSalary]: [
        undefined,
        [
          Validators.min(this.fieldLength.MinSalaryValue),
          Validators.max(this.fieldLength.MaxSalaryValue),
        ],
      ],
      [this.formField.MaxSalary]: [
        undefined,
        [
          Validators.min(this.fieldLength.MinSalaryValue),
          Validators.max(this.fieldLength.MaxSalaryValue),
        ],
      ],
      [this.formField.SalaryCurrency]: [
        { value: OfferSalaryCurrency.PLN, disabled: true },
        [Validators.required, EnumValidator(OfferSalaryCurrency)],
      ],
      [this.formField.Email]: [
        '',
        [
          Validators.maxLength(this.fieldLength.MaxEmailLength),
          (control: any) => {
            if (control.value) {
              return Validators.compose([Validators.pattern(regex.email)])!(
                control
              );
            }
            return null;
          },
        ],
      ],
      [this.formField.Description]: [
        '',
        [Validators.maxLength(this.fieldLength.MaxDescriptionLength)],
      ],
    });
  }
}
