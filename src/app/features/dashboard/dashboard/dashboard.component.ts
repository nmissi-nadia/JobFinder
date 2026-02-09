import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);

  getUserProfile() {
    return this.authService.getUserProfile();
  }

  logout(): void {
    this.authService.logout();
  }
}
