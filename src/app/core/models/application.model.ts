export interface Application {
    id?: string;
    userId: string;
    jobId: string;
    apiSource: string;
    title: string;
    company: string;
    location: string;
    url: string;
    status: 'en_attente' | 'accepte' | 'refuse';
    notes?: string;
    dateAdded: string;
}

export type ApplicationStatus = 'en_attente' | 'accepte' | 'refuse';
