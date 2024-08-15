import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThemeService } from '@jhh/jhh-client/shared/util-theme';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'jhh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.setBodyClass();
  }
}
