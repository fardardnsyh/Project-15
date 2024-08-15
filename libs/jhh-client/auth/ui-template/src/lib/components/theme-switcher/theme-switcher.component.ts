import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeService } from '@jhh/jhh-client/shared/util-theme';

import { ThemeMode } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-auth-theme-switcher',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly themeService: ThemeService = inject(ThemeService);

  isDarkMode: boolean;

  currentThemeMode$: BehaviorSubject<ThemeMode>;

  ngOnInit(): void {
    this.currentThemeMode$ = this.themeService.currentThemeMode$;
    this.setTheme();
  }

  setTheme(): void {
    this.currentThemeMode$
      .pipe(
        tap((mode) => {
          this.isDarkMode = mode === ThemeMode.Dark;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
