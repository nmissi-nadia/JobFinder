import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApplicationsService } from '../../core/services/applications.service';
import * as ApplicationsActions from './applications.actions';

@Injectable()
export class ApplicationsEffects {
    private actions$ = inject(Actions);
    private applicationsService = inject(ApplicationsService);

    loadApplications$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.loadApplications),
            switchMap(({ userId }) =>
                this.applicationsService.getApplicationsByUserId(userId).pipe(
                    map((applications) =>
                        ApplicationsActions.loadApplicationsSuccess({ applications })
                    ),
                    catchError((error) =>
                        of(
                            ApplicationsActions.loadApplicationsFailure({
                                error: error.message || 'Erreur lors du chargement des candidatures',
                            })
                        )
                    )
                )
            )
        )
    );

    addApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.addApplication),
            switchMap(({ application }) =>
                this.applicationsService.addApplication(application).pipe(
                    map((application) =>
                        ApplicationsActions.addApplicationSuccess({ application })
                    ),
                    catchError((error) =>
                        of(
                            ApplicationsActions.addApplicationFailure({
                                error: error.message || 'Erreur lors de l\'ajout de la candidature',
                            })
                        )
                    )
                )
            )
        )
    );

    updateApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.updateApplication),
            switchMap(({ id, updates }) =>
                this.applicationsService.updateApplication(id, updates).pipe(
                    map((application) =>
                        ApplicationsActions.updateApplicationSuccess({ application })
                    ),
                    catchError((error) =>
                        of(
                            ApplicationsActions.updateApplicationFailure({
                                error: error.message || 'Erreur lors de la mise à jour de la candidature',
                            })
                        )
                    )
                )
            )
        )
    );

    removeApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.removeApplication),
            switchMap(({ id }) =>
                this.applicationsService.deleteApplication(id).pipe(
                    map(() => ApplicationsActions.removeApplicationSuccess({ id })),
                    catchError((error) =>
                        of(
                            ApplicationsActions.removeApplicationFailure({
                                error: error.message || 'Erreur lors de la suppression de la candidature',
                            })
                        )
                    )
                )
            )
        )
    );
}
