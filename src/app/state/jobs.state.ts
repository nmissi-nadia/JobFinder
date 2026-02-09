import { Injectable, signal } from '@angular/core';
import { Job } from '../core/models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobsState {
  jobs = signal<Job[]>([]);
  selectedJob = signal<Job | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  setJobs(jobs: Job[]): void {
    this.jobs.set(jobs);
  }

  setSelectedJob(job: Job | null): void {
    this.selectedJob.set(job);
  }

  addJob(job: Job): void {
    this.jobs.update(jobs => [...jobs, job]);
  }

  updateJob(updatedJob: Job): void {
    this.jobs.update(jobs =>
      jobs.map(job => job.id === updatedJob.id ? updatedJob : job)
    );
  }

  deleteJob(jobId: string): void {
    this.jobs.update(jobs => jobs.filter(job => job.id !== jobId));
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
