import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { filter, first, Observable, tap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';

import { NotesGroup } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-notes-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input({ required: true }) group: NotesGroup;

  readonly clientRoute: typeof ClientRoute = ClientRoute;

  editNotesGroupSuccess$: Observable<boolean>;
  removeNotesGroupSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.editNotesGroupSuccess$ = this.notesFacade.editNotesGroupSuccess$;
    this.removeNotesGroupSuccess$ = this.notesFacade.removeNotesGroupSuccess$;

    this.navigateAfterEdit();
    this.navigateAfterRemove();
  }

  handleDuplicate(): void {
    this.notesFacade.duplicateNotesGroup(this.group.id);
  }

  openEditNotesGroupDialog(): void {
    this.editNotesGroupDialogService.openDialog(this.group);
  }

  openRemoveNotesGroupDialog(): void {
    this.removeNotesGroupDialogService.openDialog(this.group);
  }

  private navigateAfterEdit(): void {
    let currentQueryParams: Params;

    this.route.queryParams
      .pipe(
        first(),
        tap((params) => {
          currentQueryParams = params;
        })
      )
      .subscribe();

    this.editNotesGroupSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.notesFacade
            .getGroupSlug$ByGroupId(this.group.id)
            .pipe(
              first(),
              tap((slug) => {
                if (slug) {
                  this.router
                    .navigateByUrl('', { skipLocationChange: true })
                    .then(() => {
                      this.router.navigate(
                        [`${this.clientRoute.NotesLink}/${slug}`],
                        { queryParams: currentQueryParams }
                      );
                    });
                } else {
                  this.router.navigate([this.clientRoute.NotesLink]);
                }
              })
            )
            .subscribe();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateAfterRemove(): void {
    this.removeNotesGroupSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.router.navigate([this.router.url.replace(this.group.slug, '')]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
