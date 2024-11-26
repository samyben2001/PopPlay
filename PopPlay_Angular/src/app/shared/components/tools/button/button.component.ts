import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnTypes } from '../../../../enums/BtnTypes';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() text: string = "";
  @Input() btnType: BtnTypes = BtnTypes.PINK;
  @Input() disabled: boolean = false;
  @Input() isSubmit: boolean = false;
  btnTypes = BtnTypes;

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  click() {
    this.onClick.emit();
  }
}
