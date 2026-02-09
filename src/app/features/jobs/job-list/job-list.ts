import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal, effect } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobListComponent implements OnInit, AfterViewInit, OnDestroy {
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

  // Infinite Scroll
  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer: IntersectionObserver | undefined;

  constructor() {
    // Re-attach observer when jobs change (in case DOM was re-rendered)
    effect(() => {
      const jobsCount = this.jobs().length;
      if (jobsCount > 0) {
        // Wait for DOM update
        setTimeout(() => this.setupIntersectionObserver(), 100);
      }
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
  }

  disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  setupIntersectionObserver(): void {
    this.disconnectObserver(); // clean up old observer

    if (!this.sentinel || !this.sentinel.nativeElement) return;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading() && this.jobs().length > 0 && this.currentPage() < this.pageCount() - 1) {
        this.nextPage();
      }
    }, { threshold: 0.1 });

    this.observer.observe(this.sentinel.nativeElement);
  }

  loadJobs(append: boolean = false): void {
    this.isLoading.set(true);
    if (!append) this.error.set(null); // Keep error if just appending? maybe separate error state for infinite scroll

    // The Muse API uses page index starting at 0
    this.jobService.getJobs(this.currentPage(), this.location()).subscribe({
      next: (response) => {
        let newJobs = response.jobs;

        // Client-side filtering for keywords (Title) as API doesn't support it directly
        if (this.keyword()) {
          newJobs = this.jobService.filterJobsByTitle(newJobs, this.keyword());
        }

        if (append) {
          this.jobs.update(currentJobs => [...currentJobs, ...newJobs]);
        } else {
          this.jobs.set(newJobs);
        }

        this.pageCount.set(response.pageCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading jobs', err);
        if (!append) this.error.set('Erreur lors du chargement des emplois.');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.jobs.set([]);
    this.loadJobs(false);
  }

  nextPage(): void {
    if (this.currentPage() < this.pageCount() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadJobs(true);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadJobs();
    }
  }
}
