import { Injectable, signal } from '@angular/core';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  user = signal<User | null>(null);
  isLoggedIn = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);

  setUser(user: User | null): void {
    this.user.set(user);
    this.isLoggedIn.set(!!user);
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

  logout(): void {
    this.user.set(null);
    this.isLoggedIn.set(false);
  }
}
