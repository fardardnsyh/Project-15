import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { EditOfferDialogService } from '../../services/edit-offer-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { Offer } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-edit-offer',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-offer.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-offer.component.scss'],
})
export class JhhClientDashboardEditOfferComponent implements OnInit {
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );

  offerToEdit$: Observable<Offer | undefined>;

  ngOnInit(): void {
    this.offerToEdit$ = this.editOfferDialogService.offerToEdit$;
  }
}
