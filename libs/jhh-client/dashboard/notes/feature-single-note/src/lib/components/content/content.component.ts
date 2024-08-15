import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'jhh-note-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnChanges {
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  @Input({ required: true }) content: string;

  sanitizedContent: SafeHtml;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.sanitizeContent();
    }
  }

  private sanitizeContent(): void {
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
      this.content
    );
  }
}
