import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  error = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Ce champ est requis';
    }
    if (control.errors['email']) {
      return 'Email invalide';
    }
    if (control.errors['minlength']) {
      return 'Minimum 6 caractères requis';
    }
    return '';
  }

  login(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      this.error.set('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.isLoading.set(true);
    this.error.set(null);
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.error.set('Email ou mot de passe incorrect. Veuillez réessayer.');
        this.isLoading.set(false);
      },
    });
  }
}
