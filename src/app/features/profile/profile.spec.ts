import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../core/services/profile.service';
import { signal } from '@angular/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'updateProfile',
      'updateLocalUser',
      'getCurrentUser'
    ], {
      currentUser: signal({ id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com', password: 'pass' })
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    profileService.getCurrentUser.and.returnValue({
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      password: 'pass'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data', () => {
    expect(component.profileForm.getRawValue()).toEqual({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com'
    });
  });

  it('should enable editing when enableEditing is called', () => {
    component.enableEditing();
    expect(component.isEditing()).toBe(true);
    expect(component.profileForm.enabled).toBe(true);
  });

  it('should cancel editing and reset form', () => {
    component.isEditing.set(true);
    component.profileForm.enable();
    component.profileForm.patchValue({ nom: 'Test' });
    component.cancelEditing();

    expect(component.isEditing()).toBe(false);
    expect(component.profileForm.getRawValue().nom).toBe('Dupont');
  });

  it('should navigate to dashboard', () => {
    component.goToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
