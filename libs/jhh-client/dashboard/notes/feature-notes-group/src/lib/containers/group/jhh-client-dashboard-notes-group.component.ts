import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  first,
  map,
  Observable,
  pluck,
  switchMap,
  tap,
} from 'rxjs';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';
import { QueryParamsService } from '@jhh/jhh-client/dashboard/data-access';

import { Note, NotesGroup } from '@jhh/shared/domain';
import { NotesSort } from '@jhh/jhh-client/dashboard/notes/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { AddNoteComponent } from '../../components/add-note/add-note.component';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { JhhClientDashboardRemoveNoteComponent } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { JhhClientDashboardEditNoteComponent } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { JhhClientDashboardChangeNoteGroupComponent } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { JhhClientDashboardRemoveNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';
import { JhhClientDashboardEditNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { JhhClientDashboardSearchbarComponent } from '@jhh/jhh-client/dashboard/feature-searchbar';
import { JhhClientDashboardPaginationComponent } from '@jhh/jhh-client/dashboard/feature-pagination';
import { JhhClientDashboardSortingComponent } from '@jhh/jhh-client/dashboard/feature-sorting';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    NotesListComponent,
    AddNoteComponent,
    MenuComponent,
    JhhClientDashboardRemoveNoteComponent,
    JhhClientDashboardEditNoteComponent,
    JhhClientDashboardChangeNoteGroupComponent,
    JhhClientDashboardRemoveNotesGroupComponent,
    JhhClientDashboardEditNotesGroupComponent,
    JhhClientDashboardSearchbarComponent,
    JhhClientDashboardPaginationComponent,
    JhhClientDashboardSortingComponent,
  ],
  templateUrl: './jhh-client-dashboard-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-group.component.scss'],
})
export class JhhClientDashboardNotesGroupComponent
  implements OnInit, OnDestroy
{
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  groupSlug$: Observable<string>;
  group$: Observable<NotesGroup>;
  sortedNotes$: Observable<Note[]>;
  currentPage$: BehaviorSubject<number>;
  currentSort$: BehaviorSubject<string>;

  readonly sortOptionsValues: string[] = Object.values(NotesSort);
  readonly notesPerPage: number = 20;
  defaultPage: number;
  defaultSort: string;
  totalPages: number;

  ngOnInit(): void {
    this.queryParamsService.setFromCurrentRoute();
    this.defaultPage = this.queryParamsService.defaultPage;
    this.defaultSort = this.queryParamsService.defaultSort;
    this.currentPage$ = this.queryParamsService.getCurrentPage$();
    this.currentSort$ = this.queryParamsService.getCurrentSort$();

    this.groupSlug$ = this.route.params.pipe(
      pluck('groupSlug')
    ) as Observable<string>;

    this.group$ = this.groupSlug$.pipe(
      switchMap((slug: string) => this.notesFacade.getNotesGroup$BySlug(slug)),
      tap((group) => {
        if (!group) {
          this.router.navigate([ClientRoute.NotFoundLink]);
          return;
        }

        this.breadcrumbsService.updateBreadcrumbLabelByUrl(
          this.router.url.split('?')[0],
          group.name
        );
        this.titleService.setTitle(`Notes - ${group.name}`);
      }),
      filter((group): group is NotesGroup => !!group)
    );

    this.queryParamsService.updateQueryParams();

    this.getSortedNotes();
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  searchNotes = (query: string): Observable<Note[] | null> => {
    return this.group$.pipe(
      first(),
      filter((group) => !!group),
      switchMap((group) =>
        this.notesFacade.searchNotes$ByNameAndGroupId(query, group.id)
      )
    );
  };

  handlePageChange(newPage: number) {
    this.queryParamsService.updateCurrentPage(newPage);
  }

  handleSortChange(newSort: string) {
    this.queryParamsService.updateCurrentSort(newSort);
  }

  private getSortedNotes(): void {
    this.sortedNotes$ = combineLatest([
      this.group$.pipe(pluck('notes')),
      this.currentSort$,
      this.currentPage$,
    ]).pipe(
      tap(([notes]) => {
        this.totalPages = Math.ceil(notes.length / this.notesPerPage);

        const currentPage: number = this.currentPage$.getValue();
        const start: number = (currentPage - 1) * this.notesPerPage;
        if (notes.length <= start && currentPage > 1) {
          this.queryParamsService.updateCurrentPage(currentPage - 1);
        }

        this.cdr.detectChanges();
      }),
      map(([notes]) => {
        const currentPage: number = this.currentPage$.getValue();
        const currentSort: string = this.currentSort$.getValue();
        const sortedNotes: Note[] = this.sortNotes(
          notes,
          currentSort as NotesSort
        );
        const start: number = (currentPage - 1) * this.notesPerPage;
        const end: number = start + this.notesPerPage;
        return sortedNotes.slice(start, end);
      })
    );
  }

  private sortNotes(notes: Note[], sort: NotesSort): Note[] {
    switch (sort) {
      case NotesSort.Latest:
        return notes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      case NotesSort.Oldest:
        return notes
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
      case NotesSort.LastEdited:
        return notes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      case NotesSort.AlphabeticalAsc:
        return notes.slice().sort((a, b) => a.name.localeCompare(b.name));
      case NotesSort.AlphabeticalDesc:
        return notes
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .reverse();
      default:
        return notes;
    }
  }
}
