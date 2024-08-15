import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnInit {
  @Output() clickOutside: EventEmitter<void> = new EventEmitter<void>();

  private isListening: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => (this.isListening = true), 100);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    if (!this.isListening) return;

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
