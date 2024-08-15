import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Note } from '@jhh/shared/domain';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { JhhClientDashboardNoteCardComponent } from '@jhh/jhh-client/dashboard/notes/ui-note-card';

@Component({
  selector: 'jhh-notes-list',
  standalone: true,
  imports: [CommonModule, JhhClientDashboardNoteCardComponent],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);

  @Input({ required: true }) sortedNotes: Note[] | null;
  @Input({ required: true }) groupSlug: string;

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }

  trackByFn(index: number, item: Note): string {
    return item.id;
  }
}
