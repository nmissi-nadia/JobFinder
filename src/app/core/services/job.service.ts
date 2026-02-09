import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job } from '../models/job.model';

interface MuseJobResponse {
  results: Array<{
    id: number;
    name: string;
    company: { name: string };
    locations: Array<{ name: string }>;
    publication_date: string;
    contents: string;
    refs: { landing_page: string };
  }>;
  page: number;
  page_count: number; 
  total: number; 
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.themuse.com/api/public/jobs';

  getJobs(page: number = 0, location?: string, category?: string): Observable<{ jobs: Job[], pageCount: number }> {
    let params: any = { page: page };
    if (location) params.location = location;
    if (category) params.category = category;

    return this.http.get<MuseJobResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        jobs: response.results.map(job => ({
          id: job.id.toString(),
          title: job.name,
          company: job.company.name,
          location: job.locations.length > 0 ? job.locations[0].name : 'Unknown',
          datePosted: job.publication_date,
          description: job.contents,
          url: job.refs.landing_page,
        })),
        pageCount: response.page_count
      }))
    );
  }

  filterJobsByTitle(jobs: Job[], keyword: string): Job[] {
    if (!keyword) return jobs;
    return jobs.filter(job => job.title.toLowerCase().includes(keyword.toLowerCase()));
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(job => ({
        id: job.id.toString(),
        title: job.name,
        company: job.company.name,
        location: job.locations.length > 0 ? job.locations[0].name : 'Unknown',
        datePosted: job.publication_date,
        description: job.contents,
        url: job.refs.landing_page,
      }))
    );
  }
}
