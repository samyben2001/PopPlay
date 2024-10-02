import { Component, computed, inject, Signal, WritableSignal } from '@angular/core';
import { ToastTypes } from '../../../enums/ToastTypes';
import { ToastService } from '../../../services/toast.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  private toastService = inject(ToastService);
  protected isVisible: WritableSignal<boolean> = this.toastService.isVisible;
  protected message: WritableSignal<string> = this.toastService.message;
  protected titre: WritableSignal<string> = this.toastService.titre;
  private _type: WritableSignal<ToastTypes> = this.toastService.type;

  cssBg: Signal<string> = computed(() => {
    switch (this._type()) {
      case ToastTypes.SUCCESS:
        return "bg-green-800";
      case ToastTypes.ERROR:
        return "bg-red-800";
      case ToastTypes.WARNING:
        return "border-yellow-800";
      case ToastTypes.INFO:
        return "border-blue-800";
    }
  });

  Dismiss() {
    this.toastService.Dismiss();
  }
}
