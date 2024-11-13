import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[noRightClick]',
  standalone: true
})
export class NoRightClickDirective {
  
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  constructor() { }

}
