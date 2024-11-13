import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

// This directive emits an event when a click is detected outside the host element
@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  // Event emitter to notify when a click outside the element occurs
  @Output()
  public clickOutside = new EventEmitter<MouseEvent>();

  constructor(private _elementRef: ElementRef) {}

  // HostListener to listen to click events on the entire document
  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return; // Exit if no target element
    }

    // Check if the click was inside the element
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      console.log('clicked outside');
      this.clickOutside.emit(event); // Emit the event if the click was outside
    }
  }
}

