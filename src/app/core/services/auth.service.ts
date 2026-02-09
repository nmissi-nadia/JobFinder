import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, of, throwError } from 'rxjs';
import { User } from '../models/user.interface'; // Assure-toi d'avoir créé cette interface

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Injection de dépendance moderne (Angular 17+)
  private http = inject(HttpClient);

  // URL de ton JSON Server
  private apiUrl = 'http://localhost:3000/users';

  constructor() {}

  // 1. Méthode d'inscription
  register(user: User): Observable<User> {
    // Dans une vraie app, on vérifierait si l'email existe déjà.
    // Pour ce projet, on fait un POST direct.
    return this.http.post<User>(this.apiUrl, user);
  }

  // 2. Méthode de Login (Fake Auth)
  login(email: string, password: string): Observable<User> {
    // Astuce JSON Server : on peut filtrer directement dans l'URL
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          this.setSession(user); // Sauvegarde la session
          return user;
        } else {
          // Si le tableau est vide, c'est que les identifiants sont faux
          throw new Error('Email ou mot de passe incorrect');
        }
      })
    );
  }

  // 3. Gestion de la Session (LocalStorage)
  private setSession(user: User): void {
    // IMPORTANT : Le brief demande de NE PAS stocker le mot de passe
    // On utilise la destructuration pour exclure le password
    const { password, ...userWithoutPassword } = user;

    // Le brief laisse le choix entre localStorage et sessionStorage [cite: 30]
    // LocalStorage = persistant (l'utilisateur reste connecté après fermeture)
    localStorage.setItem('userToken', JSON.stringify(userWithoutPassword));
  }

  // 4. Logout
  logout(): void {
    localStorage.removeItem('userToken');
    // Rediriger vers login via le Router ici ou dans le composant
  }

  // 5. Utilitaire pour vérifier si connecté (utilisé par le Guard)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // 6. Récupérer l'utilisateur courant (pour l'affichage du profil ou l'ID dans les requêtes)
  getUserProfile(): User | null {
    const userStr = localStorage.getItem('userToken');
    return userStr ? JSON.parse(userStr) : null;
  }
}
