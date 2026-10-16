import { Component, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  readonly visible = input(false);
  readonly title = input('Confirmation');
  readonly message = input('Êtes-vous sûr ?');
  readonly confirmLabel = input('Confirmer');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
