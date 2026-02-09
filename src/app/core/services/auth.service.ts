import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model'; // Assure-toi que ce chemin est correct

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL vers le JSON Server
  private apiUrl = 'http://localhost:3000/users';

  constructor() {}

  // 1. Inscription
  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // 2. Connexion
  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          this.setSession(user);
          return user;
        } else {
          throw new Error('Email ou mot de passe incorrect');
        }
      })
    );
  }

  // 3. Gestion de session (LocalStorage)
  private setSession(user: User): void {
    // On retire le mot de passe avant de stocker
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('userToken', JSON.stringify(userWithoutPassword));
  }

  // 4. Déconnexion
  logout(): void {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  // 5. Vérification si connecté (pour le Guard)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // 6. Récupérer l'utilisateur courant
  getUserProfile(): User | null {
    const userStr = localStorage.getItem('userToken');
    return userStr ? JSON.parse(userStr) : null;
  }
}
