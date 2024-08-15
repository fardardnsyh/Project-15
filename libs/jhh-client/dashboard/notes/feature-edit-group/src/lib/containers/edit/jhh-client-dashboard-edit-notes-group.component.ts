import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { EditNotesGroupDialogService } from '../../services/edit-notes-group-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { NotesGroup } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-edit-notes-group',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-notes-group.component.scss'],
})
export class JhhClientDashboardEditNotesGroupComponent implements OnInit {
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);

  notesGroupToEdit$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.notesGroupToEdit$ = this.editNotesGroupDialogService.notesGroupToEdit$;
  }
}
