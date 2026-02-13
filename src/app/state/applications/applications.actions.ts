import { createAction, props } from '@ngrx/store';
import { Application } from '../../core/models/application.model';

// Load Applications
export const loadApplications = createAction(
    '[Applications] Load Applications',
    props<{ userId: string }>()
);

export const loadApplicationsSuccess = createAction(
    '[Applications] Load Applications Success',
    props<{ applications: Application[] }>()
);

export const loadApplicationsFailure = createAction(
    '[Applications] Load Applications Failure',
    props<{ error: string }>()
);

// Add Application
export const addApplication = createAction(
    '[Applications] Add Application',
    props<{ application: Application }>()
);

export const addApplicationSuccess = createAction(
    '[Applications] Add Application Success',
    props<{ application: Application }>()
);

export const addApplicationFailure = createAction(
    '[Applications] Add Application Failure',
    props<{ error: string }>()
);

// Update Application
export const updateApplication = createAction(
    '[Applications] Update Application',
    props<{ id: string; updates: Partial<Application> }>()
);

export const updateApplicationSuccess = createAction(
    '[Applications] Update Application Success',
    props<{ application: Application }>()
);

export const updateApplicationFailure = createAction(
    '[Applications] Update Application Failure',
    props<{ error: string }>()
);

// Remove Application
export const removeApplication = createAction(
    '[Applications] Remove Application',
    props<{ id: string }>()
);

export const removeApplicationSuccess = createAction(
    '[Applications] Remove Application Success',
    props<{ id: string }>()
);

export const removeApplicationFailure = createAction(
    '[Applications] Remove Application Failure',
    props<{ error: string }>()
);
