import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    imports: [CommonModule],
    template: `
    <div class="spinner-container" [class.inline]="inline">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
    styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: 200px;
    }

    .spinner-container.inline {
      min-height: auto;
      padding: 1rem;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner-message {
      margin-top: 1rem;
      color: #6b7280;
      font-size: 0.95rem;
      text-align: center;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
    @Input() message?: string;
    @Input() size: number = 40;
    @Input() inline: boolean = false;
}
