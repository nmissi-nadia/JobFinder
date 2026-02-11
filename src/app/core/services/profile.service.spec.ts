import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { User } from '../models/user.model';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user profile', () => {
    const mockUser: User = {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      password: 'pass'
    };

    service.getUserProfile('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3004/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update user profile', () => {
    const mockUser: User = {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      password: 'pass'
    };

    const updatedData = { nom: 'Martin', prenom: 'Jean' };

    service.updateProfile('1', updatedData).subscribe((user) => {
      expect(user.nom).toBe('Martin');
    });

    const req = httpMock.expectOne('http://localhost:3004/users/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedData);
    req.flush({ ...mockUser, ...updatedData });
  });

  it('should update local user and localStorage', () => {
    const mockUser: User = {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      password: 'pass'
    };

    service.updateLocalUser(mockUser);

    expect(service.getCurrentUser()).toEqual({
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com'
    });

    const stored = localStorage.getItem('userToken');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).nom).toBe('Dupont');
  });
});
