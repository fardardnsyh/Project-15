import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { RemoveNotesGroupDialogService } from '../../services/remove-notes-group-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { NotesGroup } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-remove-notes-group',
  standalone: true,
  imports: [CommonModule, DialogComponent, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-notes-group.component.scss'],
})
export class JhhClientDashboardRemoveNotesGroupComponent implements OnInit {
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);

  notesGroupToRemove$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.notesGroupToRemove$ =
      this.removeNotesGroupDialogService.notesGroupToRemove$;
  }
}
