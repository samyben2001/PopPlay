import { Injectable, signal } from '@angular/core';
import { ToastTypes } from '../enums/ToastTypes';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  isVisible = signal(false);
  test?: string;
  type = signal(ToastTypes.SUCCESS);
  message = signal("");
  titre = signal("");
  private _timeout: any
  //TODO: gerer plusieurs toasts en même temps => toast[]?

  /**
   * Displays a toast notification with the specified title, message, and type.
   *
   * @param titre - The title of the toast notification.
   * @param message - The message content of the toast notification.
   * @param type - The type of the toast notification, which influences its appearance. Defaults to ToastTypes.SUCCESS.
   * @param duration - The duration in milliseconds for which the toast is visible. Defaults to 5000 milliseconds.
   */
  Show(titre: string, message: string, type: ToastTypes = ToastTypes.SUCCESS, duration: number = 5000) {
    clearTimeout(this._timeout);
    this.type.set(type);
    this.titre.set(titre);
    this.message.set(message);
    this.isVisible.set(true);

    this._timeout = setTimeout(() => {
      this.isVisible.set(false);
    }, duration);
  }

  Dismiss() {
    clearTimeout(this._timeout);
    this.isVisible.set(false);
  }
}