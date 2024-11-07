import { Component, computed, inject, Signal, WritableSignal } from '@angular/core';
import { ToastTypes } from '../../../enums/ToastTypes';
import { ToastService } from '../../../services/toast.service';
import { UpperFirstPipe } from '../../pipes/upper-first.pipe';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [UpperFirstPipe],
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
        return "bg-emerald-600";
      case ToastTypes.ERROR:
        return "bg-pink-600";
      case ToastTypes.WARNING:
        return "bg-amber-600";
      case ToastTypes.INFO:
        return "bg-sky-600";
    }
  });

  Dismiss() {
    this.toastService.Dismiss();
  }
}
