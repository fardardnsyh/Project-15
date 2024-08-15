import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[whitespaceSanitizer]',
  standalone: true,
})
export class WhitespaceSanitizerDirective implements OnInit {
  private readonly control: NgControl = inject(NgControl);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly el: ElementRef = inject(ElementRef);

  private formElement: HTMLFormElement | null = null;

  ngOnInit(): void {
    this.formElement = this.el.nativeElement.closest('form');
    if (this.formElement) {
      this.renderer.listen(
        this.formElement,
        'submit',
        this.onFormSubmit.bind(this)
      );
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    this.sanitizeValue();
  }

  private onFormSubmit(event: Event): void {
    event.preventDefault();
    this.sanitizeValue(true);
  }

  private sanitizeValue(emitEvent: boolean = false): void {
    const inputValue: string = this.control.value;
    const sanitizedValue: string = inputValue?.replace(/\s{2,}/g, ' ').trim();
    if (inputValue !== sanitizedValue) {
      this.control.control?.setValue(sanitizedValue, { emitEvent: emitEvent });
    }
  }
}
