import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nom = '';
  prenom = '';
  email = '';
  password = '';
  passwordConfirm = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  register(): void {
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.error.set('Tous les champs sont requis');
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
    };

    this.isLoading.set(true);
    this.error.set(null);
    this.authService.register(newUser).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error.set('Erreur lors de l\'inscription');
        this.isLoading.set(false);
      },
    });
  }
}
