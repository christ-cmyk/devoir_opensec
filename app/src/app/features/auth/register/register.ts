import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = signal({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirm: '',
  });
  protected readonly error = signal('');
  protected readonly loading = signal(false);

  protected update(
    field: 'prenom' | 'nom' | 'email' | 'password' | 'confirm',
    value: string
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  protected async submit(): Promise<void> {
    this.error.set('');
    const { prenom, nom, email, password, confirm } = this.form();

    if (!prenom.trim() || !nom.trim()) {
      this.error.set('Nom et prénom sont obligatoires');
      return;
    }
    if (password.length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (password !== confirm) {
      this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.loading.set(true);
    const result = await this.auth.register({ email, password, nom, prenom });
    this.loading.set(false);

    if (!result.ok) {
      this.error.set(result.error ?? 'Inscription impossible');
      return;
    }
    this.router.navigate(['/login'], { queryParams: { registered: '1' } });
  }
}
