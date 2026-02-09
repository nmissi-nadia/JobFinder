import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  login(): void {
    if (!this.email || !this.password) {
      this.error.set('Email et mot de passe sont requis');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.error.set('Email ou mot de passe incorrect');
        this.isLoading.set(false);
      },
    });
  }
}
