import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoRightClick]',
  standalone: true
})
export class NoRightClickDirective {
  
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  constructor() { }

}
