import { TestBed } from '@angular/core/testing';
import { ApplicationsComponent } from './applications.component';
import { provideStore } from '@ngrx/store';
import { applicationsReducer } from '../../state/applications/applications.reducer';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ApplicationsComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApplicationsComponent],
            providers: [
                provideStore({ applications: applicationsReducer }),
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(ApplicationsComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
});
