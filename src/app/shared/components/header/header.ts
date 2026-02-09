import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
