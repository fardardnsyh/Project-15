import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { IconsComponent } from '../../components/icons/icons.component';
import { ContentComponent } from '../../components/content/content.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'jhh-auth-template',
  standalone: true,
  imports: [
    CommonModule,
    ThemeSwitcherComponent,
    IconsComponent,
    ContentComponent,
    HeaderComponent,
  ],
  templateUrl: './jhh-client-auth-ui-template.component.html',
  styleUrls: ['./jhh-client-auth-ui-template.component.scss'],
})
export class JhhClientAuthUiTemplateComponent {
  @Input({ required: true }) heading: string;
}
