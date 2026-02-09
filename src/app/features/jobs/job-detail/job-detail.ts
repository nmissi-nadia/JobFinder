import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetailComponent implements OnInit {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);

  protected job = signal<Job | null>(null);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
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
}
