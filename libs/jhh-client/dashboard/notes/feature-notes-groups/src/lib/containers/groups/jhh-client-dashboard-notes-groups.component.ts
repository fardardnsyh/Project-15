import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';

import { GroupsListComponent } from '../../components/groups-list/groups-list.component';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { JhhClientDashboardRemoveNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';
import { JhhClientDashboardEditNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { JhhClientDashboardSearchbarComponent } from '@jhh/jhh-client/dashboard/feature-searchbar';
import { JhhClientDashboardPaginationComponent } from '@jhh/jhh-client/dashboard/feature-pagination';
import { JhhClientDashboardSortingComponent } from '@jhh/jhh-client/dashboard/feature-sorting';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { QueryParamsService } from '@jhh/jhh-client/dashboard/data-access';

import { NotesGroup } from '@jhh/shared/domain';
import { NotesGroupsSort } from '@jhh/jhh-client/dashboard/notes/domain';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    GroupsListComponent,
    AddGroupComponent,
    JhhClientDashboardRemoveNotesGroupComponent,
    JhhClientDashboardEditNotesGroupComponent,
    JhhClientDashboardSearchbarComponent,
    JhhClientDashboardPaginationComponent,
    JhhClientDashboardSortingComponent,
  ],
  templateUrl: './jhh-client-dashboard-notes-groups.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-groups.component.scss'],
})
export class JhhClientDashboardNotesGroupsComponent
  implements OnInit, OnDestroy
{
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  readonly sortOptionsValues: string[] = Object.values(NotesGroupsSort);
  readonly groupsPerPage: number = 20;

  defaultPage: number;
  defaultSort: string;
  totalPages: number;

  notesGroups$: Observable<NotesGroup[] | null>;
  sortedNotesGroups$: Observable<NotesGroup[] | null>;
  currentPage$: BehaviorSubject<number>;
  currentSort$: BehaviorSubject<string>;

  ngOnInit(): void {
    this.notesGroups$ = this.notesFacade.notesGroups$;
    this.queryParamsService.setFromCurrentRoute();
    this.defaultPage = this.queryParamsService.defaultPage;
    this.defaultSort = this.queryParamsService.defaultSort;
    this.currentPage$ = this.queryParamsService.getCurrentPage$();
    this.currentSort$ = this.queryParamsService.getCurrentSort$();

    this.queryParamsService.updateQueryParams();

    this.getSortedGroups();
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  searchGroups = (query: string): Observable<NotesGroup[] | null> => {
    return this.notesFacade.searchNotesGroups$ByName(query);
  };

  handlePageChange(newPage: number): void {
    this.queryParamsService.updateCurrentPage(newPage);
  }

  handleSortChange(newSort: string): void {
    this.queryParamsService.updateCurrentSort(newSort);
  }

  private getSortedGroups(): void {
    this.sortedNotesGroups$ = combineLatest([
      this.notesGroups$,
      this.currentSort$,
      this.currentPage$,
    ]).pipe(
      filter((groups) => !!groups),
      tap(([groups]) => {
        this.totalPages = Math.ceil(groups!.length / this.groupsPerPage);
        this.cdr.detectChanges();

        const currentPage: number = this.currentPage$.getValue();
        if (
          groups!.length <= (currentPage - 1) * this.groupsPerPage &&
          currentPage > 1
        ) {
          this.queryParamsService.updateCurrentPage(currentPage - 1);
        }
      }),
      map(([groups]) => {
        const currentPage: number = this.currentPage$.getValue();
        const currentSort: string = this.currentSort$.getValue();
        const sortedGroups: NotesGroup[] = this.sortGroups(
          groups!,
          currentSort as NotesGroupsSort
        );
        const start: number = (currentPage - 1) * this.groupsPerPage;
        const end: number = start + this.groupsPerPage;
        return sortedGroups.slice(start, end);
      })
    );
  }

  private sortGroups(
    groups: NotesGroup[],
    sort: NotesGroupsSort
  ): NotesGroup[] {
    switch (sort) {
      case NotesGroupsSort.Latest:
        return groups
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      case NotesGroupsSort.Oldest:
        return groups
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
      case NotesGroupsSort.LastEdited:
        return groups
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      case NotesGroupsSort.AlphabeticalAsc:
        return groups.slice().sort((a, b) => a.name.localeCompare(b.name));
      case NotesGroupsSort.AlphabeticalDesc:
        return groups.slice().sort((a, b) => b.name.localeCompare(a.name));
      case NotesGroupsSort.AmountOfNotesAsc:
        return groups.slice().sort((a, b) => a.notes.length - b.notes.length);
      case NotesGroupsSort.AmountOfNotesDesc:
        return groups.slice().sort((a, b) => b.notes.length - a.notes.length);
      default:
        return groups;
    }
  }
}
