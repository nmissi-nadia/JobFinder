import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobListComponent implements OnInit {
  private jobService = inject(JobService);

  // Signals for state
  protected jobs = signal<Job[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  // Filters and Pagination
  protected keyword = signal('');
  protected location = signal('');
  protected currentPage = signal(0);
  protected pageCount = signal(0);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // The Muse API uses page index starting at 0
    this.jobService.getJobs(this.currentPage(), this.location()).subscribe({
      next: (response) => {
        let filteredJobs = response.jobs;

        // Client-side filtering for keywords (Title) as API doesn't support it directly
        if (this.keyword()) {
          filteredJobs = this.jobService.filterJobsByTitle(filteredJobs, this.keyword());
        }

        this.jobs.set(filteredJobs);
        this.pageCount.set(response.pageCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading jobs', err);
        this.error.set('Erreur lors du chargement des emplois. Veuillez réessayer plus tard.');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(): void {
    this.currentPage.set(0); // Reset to first page on new search
    this.loadJobs();
  }

  nextPage(): void {
    if (this.currentPage() < this.pageCount() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadJobs();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadJobs();
    }
  }
}
