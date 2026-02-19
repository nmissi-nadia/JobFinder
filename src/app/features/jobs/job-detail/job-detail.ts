import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { signal } from '@angular/core';
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
  selector: 'app-job-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetailComponent implements OnInit {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected job = signal<Job | null>(null);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  protected favorites = this.store.selectSignal(selectAllFavorites);
  protected applications = this.store.selectSignal(selectAllApplications);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
    }
    const user = this.authService.getUserProfile();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
      this.store.dispatch(ApplicationsActions.loadApplications({ userId: user.id }));
    }
  }

  loadJob(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.job.set(job);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement de l\'emploi');
        this.isLoading.set(false);
      },
    });
  }

  isFavorite(): boolean {
    const currentJob = this.job();
    if (!currentJob) return false;
    return this.favorites().some(f => f.jobId === currentJob.id);
  }

  toggleFavorite(): void {
    const user = this.authService.getUserProfile();
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des favoris.');
      return;
    }

    const currentJob = this.job();
    if (!currentJob) return;

    const existingFavorite = this.favorites().find(f => f.jobId === currentJob.id);
    if (existingFavorite) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: existingFavorite.id! }));
    } else {
      const favorite: Favorite = {
        userId: user.id,
        jobId: currentJob.id,
        jobTitle: currentJob.title,
        company: currentJob.company,
        location: currentJob.location
      };
      this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
    }
  }

  isTracked(): boolean {
    const currentJob = this.job();
    if (!currentJob) return false;
    return this.applications().some(app => app.jobId === currentJob.id);
  }

  trackApplication(): void {
    const user = this.authService.getUserProfile();
    if (!user) {
      alert('Veuillez vous connecter pour suivre des candidatures.');
      return;
    }

    const currentJob = this.job();
    if (!currentJob) return;

    if (this.isTracked()) {
      alert('Cette offre est déjà suivie dans vos candidatures.');
      return;
    }

    const application: Application = {
      userId: user.id,
      jobId: currentJob.id,
      apiSource: 'themuse',
      title: currentJob.title,
      company: currentJob.company,
      location: currentJob.location,
      url: currentJob.url,
      status: 'en_attente',
      dateAdded: new Date().toISOString()
    };
    this.store.dispatch(ApplicationsActions.addApplication({ application }));
  }

  applyToJob(): void {
    const user = this.authService.getUserProfile();
    if (!user) {
      alert('Veuillez vous connecter pour postuler.');
      return;
    }

    const currentJob = this.job();
    if (!currentJob) return;

    // Automatically track the application if not already tracked
    if (!this.isTracked()) {
      const application: Application = {
        userId: user.id,
        jobId: currentJob.id,
        apiSource: 'themuse',
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        url: currentJob.url,
        status: 'en_attente',
        dateAdded: new Date().toISOString()
      };
      this.store.dispatch(ApplicationsActions.addApplication({ application }));
    }

    // Navigate to applications page
    this.router.navigate(['/applications']);
  }
}
