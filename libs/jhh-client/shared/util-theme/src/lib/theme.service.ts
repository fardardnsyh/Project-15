import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import { ThemeMode } from '@jhh/jhh-client/shared/domain';
import { LocalStorageKey } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  currentThemeMode$: BehaviorSubject<ThemeMode> =
    new BehaviorSubject<ThemeMode>(this.getStoredThemeMode());

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.setBodyClass();
  }

  setBodyClass(): void {
    this.renderer.addClass(document.body, this.currentThemeMode$.getValue());
  }

  toggleTheme(): void {
    const newThemeMode: ThemeMode =
      this.currentThemeMode$.getValue() === ThemeMode.Dark
        ? ThemeMode.Light
        : ThemeMode.Dark;

    this.updateThemeMode(newThemeMode);
  }

  private updateThemeMode(themeMode: ThemeMode): void {
    this.renderer.removeClass(document.body, this.currentThemeMode$.getValue());
    this.renderer.addClass(document.body, themeMode);

    this.currentThemeMode$.next(themeMode);
    localStorage.setItem(LocalStorageKey.ThemeMode, themeMode);
  }

  private getStoredThemeMode(): ThemeMode {
    return (
      (localStorage.getItem(LocalStorageKey.ThemeMode) as ThemeMode) ||
      ThemeMode.Dark
    );
  }
}
