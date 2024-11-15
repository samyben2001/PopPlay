import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  isVisible = signal(false);
  message = signal("");

  /**
   * Displays a confirmation pop-up with the specified message.
   *
   * @param message - The message content of the toast notification.
   */
  Show(message: string) {
    this.message.set(message);
    this.isVisible.set(true);
  }

  Dismiss() {
    this.isVisible.set(false);
  }
}
