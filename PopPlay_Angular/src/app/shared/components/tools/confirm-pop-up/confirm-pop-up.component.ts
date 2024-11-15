import { Component, EventEmitter, inject, Output, WritableSignal } from '@angular/core';
import { PopUpService } from '../../../../services/tools/pop-up.service';
import { UpperFirstPipe } from '../../../pipes/upper-first.pipe';

@Component({
  selector: 'app-confirm-pop-up',
  standalone: true,
  imports: [UpperFirstPipe],
  templateUrl: './confirm-pop-up.component.html',
  styleUrl: './confirm-pop-up.component.css'
})
export class ConfirmPopUpComponent {
  private popupService = inject(PopUpService); // TODO: Service may not be useful? transfer to component instead?
  protected isVisible: WritableSignal<boolean> = this.popupService.isVisible;
  protected message: WritableSignal<string> = this.popupService.message;
  @Output() confirmEvent = new EventEmitter<void>();
  @Output() dismissEvent = new EventEmitter<void>();

  confirm() {
    this.popupService.Dismiss();
    this.confirmEvent.emit();
  }

  dismiss() {
    this.popupService.Dismiss();
    this.dismissEvent.emit();
  }

}
