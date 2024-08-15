import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { EditNoteDialogService } from '../../services/edit-note-dialog.service';

import { Note } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-edit-note',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-note.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-note.component.scss'],
})
export class JhhClientDashboardEditNoteComponent implements OnInit {
  private readonly editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );

  noteToEdit$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.noteToEdit$ = this.editNoteDialogService.noteToEdit$;
  }
}
