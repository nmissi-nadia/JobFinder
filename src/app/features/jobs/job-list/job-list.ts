import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';
import { selectAllFavorites } from '../../../state/favorites/favorites.selectors';
import { Favorite } from '../../../core/services/favorites.service';
import * as ApplicationsActions from '../../../state/applications/applications.actions';
import { selectAllApplications } from '../../../state/applications/applications.selectors';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobListComponent implements OnInit, AfterViewInit {
  private jobService = inject(JobService);
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('sentinel') sentinel!: ElementRef;

  protected jobs = signal<Job[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);
  protected keyword = '';
  protected location = '';
  protected page = 0;
  protected hasMore = true;

  protected favorites = this.store.selectSignal(selectAllFavorites);
  protected applications = this.store.selectSignal(selectAllApplications);

  ngOnInit(): void {
    this.loadJobs();
    const user = this.authService.getUserProfile();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
      this.store.dispatch(ApplicationsActions.loadApplications({ userId: user.id }));
    }
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  loadJobs(): void {
    if (this.isLoading() || !this.hasMore) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.jobService.getJobs(this.page, this.location, this.keyword).subscribe({
      next: (response) => {
        const newJobs = response.jobs;
        if (newJobs.length === 0) {
          this.hasMore = false;
        } else {
          this.jobs.update(current => [...current, ...newJobs]);
          this.page++;
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des offres');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(): void {
    this.jobs.set([]);
    this.page = 0;
    this.hasMore = true;
    this.loadJobs();
  }

  setupInfiniteScroll(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoading() && this.hasMore) {
          this.loadJobs();
        }
      },
      { threshold: 0.1 }
    );

    if (this.sentinel) {
      observer.observe(this.sentinel.nativeElement);
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

  isTracked(jobId: string): boolean {
    return this.applications().some(app => app.jobId === jobId);
  }

  trackApplication(job: Job): void {
    const user = this.authService.getUserProfile();
    if (!user) {
      alert('Veuillez vous connecter pour suivre des candidatures.');
      return;
    }

    if (this.isTracked(job.id)) {
      alert('Cette offre est déjà suivie dans vos candidatures.');
      return;
    }

    const application: Application = {
      userId: user.id,
      jobId: job.id,
      apiSource: 'themuse',
      title: job.title,
      company: job.company,
      location: job.location,
      url: job.url,
      status: 'en_attente',
      dateAdded: new Date().toISOString()
    };
    this.store.dispatch(ApplicationsActions.addApplication({ application }));
  }

  applyToJob(job: Job): void {
    const user = this.authService.getUserProfile();
    if (!user) {
      alert('Veuillez vous connecter pour postuler.');
      return;
    }

    // Automatically track the application if not already tracked
    if (!this.isTracked(job.id)) {
      const application: Application = {
        userId: user.id,
        jobId: job.id,
        apiSource: 'themuse',
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        status: 'en_attente',
        dateAdded: new Date().toISOString()
      };
      this.store.dispatch(ApplicationsActions.addApplication({ application }));
    }

    // Navigate to applications page
    this.router.navigate(['/applications']);
  }

  // TrackBy function for performance optimization
  trackByJobId(index: number, job: Job): string {
    return job.id;
  }
}
