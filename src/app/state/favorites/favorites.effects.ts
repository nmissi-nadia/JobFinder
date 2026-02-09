import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { FavoritesService } from '../../core/services/favorites.service';
import * as FavoritesActions from './favorites.actions';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private favoritesService = inject(FavoritesService);

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            switchMap(({ userId }) =>
                this.favoritesService.getFavorites(userId).pipe(
                    map((favorites) => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError((error) => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap(({ favorite }) =>
                this.favoritesService.addFavorite(favorite).pipe(
                    map((newFavorite) => FavoritesActions.addFavoriteSuccess({ favorite: newFavorite })),
                    catchError((error) => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap(({ id }) =>
                this.favoritesService.removeFavorite(id).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ id })),
                    catchError((error) => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
                )
            )
        )
    );
}
