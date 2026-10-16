import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly error = signal('');
  protected readonly loading = signal(false);

  protected async submit(): Promise<void> {
    this.error.set('');
    if (!this.email() || !this.password()) {
      this.error.set('Identifiants invalides');
      return;
    }
    this.loading.set(true);
    const result = await this.auth.login(this.email(), this.password());
    this.loading.set(false);

    if (!result.ok) {
      this.error.set(result.error ?? 'Identifiants invalides');
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl && !returnUrl.startsWith('/login')) {
      this.router.navigateByUrl(returnUrl);
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
