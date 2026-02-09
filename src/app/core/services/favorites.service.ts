import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../../core/models/job.model';

export interface Favorite {
    id?: string;
    userId: string;
    jobId: string;
    jobTitle: string;
    company: string;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3004/favoritesOffers';

    getFavorites(userId: string): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(favorite: Favorite): Observable<Favorite> {
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Check if a job is already favorited (optional for service, but useful)
    checkFavorite(userId: string, jobId: string): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&jobId=${jobId}`);
    }
}
