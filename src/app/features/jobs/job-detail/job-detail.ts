import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';
import { selectAllFavorites } from '../../../state/favorites/favorites.selectors';
import { Favorite } from '../../../core/services/favorites.service';

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

  protected job = signal<Job | null>(null);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  protected favorites = this.store.selectSignal(selectAllFavorites);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
    }
    const user = this.authService.getUserProfile();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
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
}
