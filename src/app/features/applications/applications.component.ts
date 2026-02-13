import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Application } from '../../core/models/application.model';
import { AuthService } from '../../core/services/auth.service';
import * as ApplicationsActions from '../../state/applications/applications.actions';
import {
    selectAllApplications,
    selectApplicationsLoading,
    selectApplicationsError,
    selectApplicationsByStatus,
} from '../../state/applications/applications.selectors';

@Component({
    selector: 'app-applications',
    imports: [CommonModule, FormsModule],
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
    private store = inject(Store);
    private authService = inject(AuthService);

    // State from NgRx
    protected applications = this.store.selectSignal(selectAllApplications);
    protected isLoading = this.store.selectSignal(selectApplicationsLoading);
    protected error = this.store.selectSignal(selectApplicationsError);

    // Local state
    protected filterStatus = signal<'all' | 'en_attente' | 'accepte' | 'refuse'>('all');
    protected editingNotes = signal<{ [key: string]: boolean }>({});
    protected notesInput = signal<{ [key: string]: string }>({});

    ngOnInit(): void {
        const user = this.authService.getUserProfile();
        if (user) {
            this.store.dispatch(ApplicationsActions.loadApplications({ userId: user.id }));
        }
    }

    get filteredApplications(): Application[] {
        const status = this.filterStatus();
        if (status === 'all') {
            return this.applications();
        }
        return this.applications().filter((app) => app.status === status);
    }

    setFilter(status: 'all' | 'en_attente' | 'accepte' | 'refuse'): void {
        this.filterStatus.set(status);
    }

    updateStatus(application: Application, newStatus: 'en_attente' | 'accepte' | 'refuse'): void {
        if (application.id) {
            this.store.dispatch(
                ApplicationsActions.updateApplication({
                    id: application.id,
                    updates: { status: newStatus },
                })
            );
        }
    }

    startEditingNotes(applicationId: string, currentNotes?: string): void {
        this.editingNotes.update((state) => ({ ...state, [applicationId]: true }));
        this.notesInput.update((state) => ({ ...state, [applicationId]: currentNotes || '' }));
    }

    cancelEditingNotes(applicationId: string): void {
        this.editingNotes.update((state) => ({ ...state, [applicationId]: false }));
    }

    saveNotes(application: Application): void {
        if (application.id) {
            const notes = this.notesInput()[application.id];
            this.store.dispatch(
                ApplicationsActions.updateApplication({
                    id: application.id,
                    updates: { notes },
                })
            );
            this.editingNotes.update((state) => ({ ...state, [application.id!]: false }));
        }
    }

    deleteApplication(applicationId: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            this.store.dispatch(ApplicationsActions.removeApplication({ id: applicationId }));
        }
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            en_attente: 'En attente',
            accepte: 'Accepté',
            refuse: 'Refusé',
        };
        return labels[status] || status;
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            en_attente: 'status-pending',
            accepte: 'status-accepted',
            refuse: 'status-refused',
        };
        return classes[status] || '';
    }

    getApplicationsCount(status: 'all' | 'en_attente' | 'accepte' | 'refuse'): number {
        if (status === 'all') {
            return this.applications().length;
        }
        return this.applications().filter((app) => app.status === status).length;
    }
}
