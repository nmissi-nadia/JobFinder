import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3004/users';

  // Signal pour l'utilisateur courant
  currentUser = signal<User | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  /**
   * Charger l'utilisateur courant depuis le localStorage
   */
  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('userToken');
    if (userStr) {
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  /**
   * Récupérer le profil complet depuis l'API
   */
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  updateProfile(userId: string, updatedUser: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, updatedUser);
  }

  /**
   * Mettre à jour l'utilisateur local et le stockage
   */
  updateLocalUser(user: User): void {
    const { password, ...userWithoutPassword } = user;
    this.currentUser.set(user);
    localStorage.setItem('userToken', JSON.stringify(userWithoutPassword));
  }

  /**
   * Récupérer l'utilisateur courant
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
