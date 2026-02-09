import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobListComponent implements OnInit {
  private jobService = inject(JobService);

  protected jobs = signal<Job[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des emplois');
        this.isLoading.set(false);
      },
    });
  }
}
