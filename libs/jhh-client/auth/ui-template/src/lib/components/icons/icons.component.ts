import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Icon {
  svgSrc: string;
  name: string;
  tooltip: string;
  link: string;
}

@Component({
  selector: 'jhh-auth-icons',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent implements OnInit {
  private readonly matIconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  icons: Icon[] = [
    {
      svgSrc: 'assets/icons/github.svg',
      name: 'github',
      tooltip: 'GitHub',
      link: 'https://github.com/MiloszBaranskiDev/job-hunting-helper',
    },
    {
      svgSrc: 'assets/icons/linkedin.svg',
      name: 'linkedin',
      tooltip: 'Linkedin',
      link: 'https://www.linkedin.com/in/mi%C5%82osz-bara%C5%84ski-8617721b1/',
    },
    {
      svgSrc: 'assets/icons/email.svg',
      name: 'email',
      tooltip: 'Contact',
      link: 'https://miloszbaranskidev.github.io/my-website/',
    },
  ];

  ngOnInit(): void {
    this.registerIcons();
  }

  private registerIcons(): void {
    this.icons.forEach((icon: Icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.svgSrc)
      );
    });
  }
}
