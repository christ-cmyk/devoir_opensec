import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  message: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly current = signal<AppNotification | null>(null);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  clear(): void {
    this.current.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private show(message: string, type: NotificationType): void {
    this.clear();
    this.current.set({ message, type });
    this.timeoutId = setTimeout(() => this.current.set(null), 4000);
  }
}
