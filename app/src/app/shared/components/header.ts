import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABEL } from '../../core/utils/labels';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly roleLabel = ROLE_LABEL;

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
