import { createReducer, on } from '@ngrx/store';
import { Favorite } from '../../core/services/favorites.service';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
    favorites: Favorite[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: FavoritesState = {
    favorites: [],
    isLoading: false,
    error: null,
};

export const favoritesReducer = createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        favorites,
        isLoading: false,
    })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
        ...state,
        favorites: [...state.favorites, favorite],
    })),
    on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== id),
    })),
    on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
        ...state,
        error,
    }))
);
