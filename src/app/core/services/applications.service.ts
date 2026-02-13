import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
    providedIn: 'root',
})
export class ApplicationsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3004/applications';

    /**
     * Récupère toutes les candidatures d'un utilisateur
     */
    getApplicationsByUserId(userId: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
    }

    /**
     * Ajoute une nouvelle candidature
     */
    addApplication(application: Application): Observable<Application> {
        return this.http.post<Application>(this.apiUrl, application);
    }

    /**
     * Met à jour une candidature existante (statut, notes)
     */
    updateApplication(id: string, updates: Partial<Application>): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, updates);
    }

    /**
     * Supprime une candidature
     */
    deleteApplication(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Vérifie si une offre est déjà suivie par l'utilisateur
     */
    isJobTracked(userId: string, jobId: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&jobId=${jobId}`);
    }
}
