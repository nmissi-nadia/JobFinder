import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet />
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
      padding: 2rem 0;
    }
  `]
})
export class App {
  protected readonly title = signal('job-finder');
}
