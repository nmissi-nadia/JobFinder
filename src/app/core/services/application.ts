import { Injectable, inject, signal } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private authService = inject(AuthService);
  
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.initializeUser();
  }

  private initializeUser(): void {
    const user = this.authService.getUserProfile();
    if (user) {
      this.currentUser.set(user);
    }
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  clearError(): void {
    this.error.set(null);
  }
}
