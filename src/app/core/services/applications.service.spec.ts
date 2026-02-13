import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationsService } from './applications.service';
import { Application } from '../models/application.model';

describe('ApplicationsService', () => {
    let service: ApplicationsService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:3004/applications';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ApplicationsService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(ApplicationsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get applications by user ID', () => {
        const mockApplications: Application[] = [
            {
                id: '1',
                userId: 'user1',
                jobId: 'job1',
                apiSource: 'themuse',
                title: 'Developer',
                company: 'Tech Corp',
                location: 'New York',
                url: 'https://example.com',
                status: 'en_attente',
                dateAdded: '2026-02-13T10:00:00Z'
            }
        ];

        service.getApplicationsByUserId('user1').subscribe(applications => {
            expect(applications).toEqual(mockApplications);
            expect(applications.length).toBe(1);
        });

        const req = httpMock.expectOne(`${apiUrl}?userId=user1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockApplications);
    });

    it('should add a new application', () => {
        const newApplication: Application = {
            userId: 'user1',
            jobId: 'job1',
            apiSource: 'themuse',
            title: 'Developer',
            company: 'Tech Corp',
            location: 'New York',
            url: 'https://example.com',
            status: 'en_attente',
            dateAdded: '2026-02-13T10:00:00Z'
        };

        const mockResponse: Application = { ...newApplication, id: '1' };

        service.addApplication(newApplication).subscribe(application => {
            expect(application).toEqual(mockResponse);
            expect(application.id).toBe('1');
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newApplication);
        req.flush(mockResponse);
    });

    it('should update an application', () => {
        const updates: Partial<Application> = {
            status: 'accepte',
            notes: 'Interview scheduled'
        };

        const mockResponse: Application = {
            id: '1',
            userId: 'user1',
            jobId: 'job1',
            apiSource: 'themuse',
            title: 'Developer',
            company: 'Tech Corp',
            location: 'New York',
            url: 'https://example.com',
            status: 'accepte',
            notes: 'Interview scheduled',
            dateAdded: '2026-02-13T10:00:00Z'
        };

        service.updateApplication('1', updates).subscribe(application => {
            expect(application.status).toBe('accepte');
            expect(application.notes).toBe('Interview scheduled');
        });

        const req = httpMock.expectOne(`${apiUrl}/1`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(updates);
        req.flush(mockResponse);
    });

    it('should delete an application', () => {
        service.deleteApplication('1').subscribe(response => {
            expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should check if a job is tracked', () => {
        const mockApplications: Application[] = [
            {
                id: '1',
                userId: 'user1',
                jobId: 'job1',
                apiSource: 'themuse',
                title: 'Developer',
                company: 'Tech Corp',
                location: 'New York',
                url: 'https://example.com',
                status: 'en_attente',
                dateAdded: '2026-02-13T10:00:00Z'
            }
        ];

        service.isJobTracked('user1', 'job1').subscribe(applications => {
            expect(applications.length).toBe(1);
            expect(applications[0].jobId).toBe('job1');
        });

        const req = httpMock.expectOne(`${apiUrl}?userId=user1&jobId=job1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockApplications);
    });
});
