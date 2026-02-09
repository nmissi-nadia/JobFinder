import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/jobs';

  // Récupérer tous les emplois
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  // Récupérer un emploi par ID
  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  // Créer un emploi
  createJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  // Modifier un emploi
  updateJob(id: string, job: Job): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  // Supprimer un emploi
  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Rechercher des emplois
  searchJobs(query: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}?q=${query}`);
  }
}
