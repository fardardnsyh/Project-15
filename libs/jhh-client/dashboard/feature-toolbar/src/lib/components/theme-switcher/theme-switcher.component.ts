import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject, tap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeService } from '@jhh/jhh-client/shared/util-theme';

import { ThemeMode } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-theme-switcher',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly themeService: ThemeService = inject(ThemeService);

  @Input({ required: true }) isBreakpointMobile: boolean | null;

  currentThemeMode$: BehaviorSubject<ThemeMode>;

  isDarkMode: boolean;

  ngOnInit(): void {
    this.currentThemeMode$ = this.themeService.currentThemeMode$;
    this.currentThemeMode$
      .pipe(
        tap((themeMode) => {
          this.isDarkMode = themeMode === ThemeMode.Dark;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
