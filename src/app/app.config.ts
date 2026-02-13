import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { favoritesReducer } from './state/favorites/favorites.reducer';
import { FavoritesEffects } from './state/favorites/favorites.effects';
import { applicationsReducer } from './state/applications/applications.reducer';
import { ApplicationsEffects } from './state/applications/applications.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      favorites: favoritesReducer,
      applications: applicationsReducer
    }),
    provideEffects([FavoritesEffects, ApplicationsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
