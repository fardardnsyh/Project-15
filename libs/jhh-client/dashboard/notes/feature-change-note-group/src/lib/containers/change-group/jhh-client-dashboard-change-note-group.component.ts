import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Note } from '@jhh/shared/domain';

import { DialogComponent } from '../../components/dialog/dialog.component';
import { ChangeNoteGroupDialogService } from '../../services/change-note-group-dialog.service';

@Component({
  selector: 'jhh-change-note-group',
  standalone: true,
  imports: [CommonModule, DialogComponent, DialogComponent],
  templateUrl: './jhh-client-dashboard-change-note-group.component.html',
  styleUrls: ['./jhh-client-dashboard-change-note-group.component.scss'],
})
export class JhhClientDashboardChangeNoteGroupComponent implements OnInit {
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);

  noteToMove$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.noteToMove$ = this.changeNoteGroupDialogService.noteToMove$;
  }
}
