import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationsState } from './applications.reducer';

export const selectApplicationsState = createFeatureSelector<ApplicationsState>('applications');

export const selectAllApplications = createSelector(
    selectApplicationsState,
    (state: ApplicationsState) => state.applications
);

export const selectApplicationsLoading = createSelector(
    selectApplicationsState,
    (state: ApplicationsState) => state.isLoading
);

export const selectApplicationsError = createSelector(
    selectApplicationsState,
    (state: ApplicationsState) => state.error
);

export const selectApplicationsByStatus = (status: 'en_attente' | 'accepte' | 'refuse') =>
    createSelector(selectAllApplications, (applications) =>
        applications.filter((app) => app.status === status)
    );

export const selectApplicationByJobId = (jobId: string) =>
    createSelector(selectAllApplications, (applications) =>
        applications.find((app) => app.jobId === jobId)
    );

export const selectApplicationsCount = createSelector(
    selectAllApplications,
    (applications) => applications.length
);

export const selectApplicationsCountByStatus = createSelector(
    selectAllApplications,
    (applications) => ({
        en_attente: applications.filter((app) => app.status === 'en_attente').length,
        accepte: applications.filter((app) => app.status === 'accepte').length,
        refuse: applications.filter((app) => app.status === 'refuse').length,
    })
);
