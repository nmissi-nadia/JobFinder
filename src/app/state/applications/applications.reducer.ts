import { createReducer, on } from '@ngrx/store';
import { Application } from '../../core/models/application.model';
import * as ApplicationsActions from './applications.actions';

export interface ApplicationsState {
    applications: Application[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: ApplicationsState = {
    applications: [],
    isLoading: false,
    error: null,
};

export const applicationsReducer = createReducer(
    initialState,

    // Load Applications
    on(ApplicationsActions.loadApplications, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(ApplicationsActions.loadApplicationsSuccess, (state, { applications }) => ({
        ...state,
        applications,
        isLoading: false,
    })),
    on(ApplicationsActions.loadApplicationsFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    // Add Application
    on(ApplicationsActions.addApplication, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(ApplicationsActions.addApplicationSuccess, (state, { application }) => ({
        ...state,
        applications: [...state.applications, application],
        isLoading: false,
    })),
    on(ApplicationsActions.addApplicationFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    // Update Application
    on(ApplicationsActions.updateApplication, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(ApplicationsActions.updateApplicationSuccess, (state, { application }) => ({
        ...state,
        applications: state.applications.map((app) =>
            app.id === application.id ? application : app
        ),
        isLoading: false,
    })),
    on(ApplicationsActions.updateApplicationFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    // Remove Application
    on(ApplicationsActions.removeApplication, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(ApplicationsActions.removeApplicationSuccess, (state, { id }) => ({
        ...state,
        applications: state.applications.filter((app) => app.id !== id),
        isLoading: false,
    })),
    on(ApplicationsActions.removeApplicationFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    }))
);
