import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { RemoveNoteDialogService } from '../../services/remove-note-dialog.service';

import { Note } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-remove-note',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-note.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-note.component.scss'],
})
export class JhhClientDashboardRemoveNoteComponent implements OnInit {
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );

  noteToRemove$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.noteToRemove$ = this.removeNoteDialogService.noteToRemove$;
  }
}
