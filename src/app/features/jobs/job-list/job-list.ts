import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';
import { selectAllFavorites } from '../../../state/favorites/favorites.selectors';
import { Favorite } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobListComponent implements OnInit, AfterViewInit, OnDestroy {
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private store = inject(Store);

  // Signals for state
  protected jobs = signal<Job[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  // Favorites State
  protected favorites = this.store.selectSignal(selectAllFavorites);

  // Filters and Pagination
  protected keyword = signal('');
  protected location = signal('');
  protected currentPage = signal(0);
  protected pageCount = signal(0);

  // Infinite Scroll
  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer: IntersectionObserver | undefined;

  constructor() {
    // Re-attach observer when jobs change
    effect(() => {
      const jobsCount = this.jobs().length;
      if (jobsCount > 0) {
        setTimeout(() => this.setupIntersectionObserver(), 100);
      }
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    const user = this.authService.getUserProfile();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
    }
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
    this.disconnectObserver();
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
    if (!append) this.error.set(null);

    this.jobService.getJobs(this.currentPage(), this.location()).subscribe({
      next: (response) => {
        let newJobs = response.jobs;
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

  isFavorite(jobId: string): boolean {
    return this.favorites().some(f => f.jobId === jobId);
  }

  toggleFavorite(job: Job): void {
    const user = this.authService.getUserProfile();
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des favoris.');
      return;
    }

    const existingFavorite = this.favorites().find(f => f.jobId === job.id);
    if (existingFavorite) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: existingFavorite.id! }));
    } else {
      const favorite: Favorite = {
        userId: user.id,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location
      };
      this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
    }
  }
}
