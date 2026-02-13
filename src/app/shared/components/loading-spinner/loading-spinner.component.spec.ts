import { TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadingSpinnerComponent]
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(LoadingSpinnerComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should display message when provided', () => {
        const fixture = TestBed.createComponent(LoadingSpinnerComponent);
        const component = fixture.componentInstance;
        component.message = 'Loading...';
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.spinner-message').textContent).toContain('Loading...');
    });
});
