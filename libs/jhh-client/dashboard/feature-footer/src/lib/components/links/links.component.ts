import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Link {
  icon: string;
  url: string;
  text: string;
}

@Component({
  selector: 'jhh-footer-links',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent {
  readonly links: Link[] = [
    {
      icon: 'code',
      url: 'https://github.com/MiloszBaranskiDev/job-hunting-helper',
      text: 'Source code',
    },
    {
      icon: 'email',
      url: 'https://miloszbaranskidev.github.io/my-website/',
      text: 'Contact',
    },
  ];
}
