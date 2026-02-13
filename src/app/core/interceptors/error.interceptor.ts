import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Erreur: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        errorMessage = 'Requête invalide. Veuillez vérifier vos données.';
                        break;
                    case 401:
                        errorMessage = 'Non autorisé. Veuillez vous connecter.';
                        router.navigate(['/login']);
                        break;
                    case 403:
                        errorMessage = 'Accès interdit.';
                        break;
                    case 404:
                        errorMessage = 'Ressource non trouvée.';
                        break;
                    case 500:
                        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                        break;
                    case 503:
                        errorMessage = 'Service temporairement indisponible.';
                        break;
                    default:
                        errorMessage = `Erreur ${error.status}: ${error.message}`;
                }
            }

            console.error('HTTP Error:', errorMessage, error);
            return throwError(() => new Error(errorMessage));
        })
    );
};
