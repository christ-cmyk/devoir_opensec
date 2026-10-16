import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { ROLE_LABEL } from '../../core/utils/labels';
import { Role } from '../../core/models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, DatePipe, ConfirmDialog],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  protected readonly userService = inject(UserService);
  protected readonly auth = inject(AuthService);
  protected readonly notifications = inject(NotificationService);

  protected readonly pendingDelete = signal<string | null>(null);
  protected readonly roleLabel = ROLE_LABEL;
  protected readonly roles: Role[] = ['ADMIN', 'GESTIONNAIRE', 'CONDUCTEUR'];

  protected get users() {
    return this.userService.users();
  }

  protected changeRole(id: string, role: string): void {
    const result = this.userService.changeRole(id, role as Role);
    if (result.ok) {
      this.notifications.success('Rôle mis à jour');
    } else {
      this.notifications.error(result.error ?? 'Modification impossible');
    }
  }

  protected askDelete(id: string): void {
    this.pendingDelete.set(id);
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const id = this.pendingDelete();
    if (!id) {
      return;
    }
    const result = this.userService.delete(id);
    this.pendingDelete.set(null);
    if (result.ok) {
      this.notifications.success('Utilisateur supprimé');
    } else {
      this.notifications.error(result.error ?? 'Suppression impossible');
    }
  }

  protected isSelf(id: string): boolean {
    return this.auth.currentUser()?.id === id;
  }
}
