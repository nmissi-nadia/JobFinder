import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Favorite } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';
import * as FavoritesActions from '../../state/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading, selectFavoritesError } from '../../state/favorites/favorites.selectors';

@Component({
    selector: 'app-favorites',
    imports: [CommonModule, RouterLink],
    templateUrl: './favorites.html',
    styleUrl: './favorites.css',
})
export class FavoritesComponent implements OnInit {
    private store = inject(Store);
    private authService = inject(AuthService);

    favorites$: Observable<Favorite[]> = this.store.select(selectAllFavorites);
    isLoading$: Observable<boolean> = this.store.select(selectFavoritesLoading);
    error$: Observable<string | null> = this.store.select(selectFavoritesError);

    ngOnInit(): void {
        const user = this.authService.getUserProfile();
        if (user) {
            this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        }
    }

    removeFavorite(id: string): void {
        if (confirm('Voulez-vous vraiment retirer cette offre des favoris ?')) {
            this.store.dispatch(FavoritesActions.removeFavorite({ id }));
        }
    }
}
