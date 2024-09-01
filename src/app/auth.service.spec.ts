import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate') // Spy on the navigate method
          }
        }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Clear localStorage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store token and navigate to home on successful login', () => {
      const mockResponse = { token: 'fake-token' };
      const email = 'test@example.com';
      const password = 'password123';

      service.login(email, password).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/api/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(localStorage.getItem('authToken')).toBe('fake-token');
      expect(localStorage.getItem('userEmail')).toBe(email);
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should handle error response', () => {
      const email = 'test@example.com';
      const password = 'password123';

      service.login(email, password).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/api/login');
      req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('adminLogin', () => {
    it('should store admin token and navigate to admin products page', () => {
      const email = 'admin@example.com';

      service.adminLogin(email);

      expect(localStorage.getItem('adminToken')).toBe('true');
      expect(localStorage.getItem('userEmail')).toBe(email);
      expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
    });
  });

  describe('logout', () => {
    it('should clear user token and navigate to login page', () => {
      localStorage.setItem('authToken', 'fake-token');
      localStorage.setItem('userEmail', 'user@example.com');

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userEmail')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('logoutAdmin', () => {
    it('should clear admin token and navigate to login page', () => {
      localStorage.setItem('adminToken', 'true');
      localStorage.setItem('userEmail', 'admin@example.com');

      service.logoutAdmin();

      expect(localStorage.getItem('adminToken')).toBeNull();
      expect(localStorage.getItem('userEmail')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if authToken is present', () => {
      localStorage.setItem('authToken', 'fake-token');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if authToken is not present', () => {
      localStorage.removeItem('authToken');
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('isAdminLoggedIn', () => {
    it('should return true if adminToken is present', () => {
      localStorage.setItem('adminToken', 'true');
      expect(service.isAdminLoggedIn()).toBeTrue();
    });

    it('should return false if adminToken is not present', () => {
      localStorage.removeItem('adminToken');
      expect(service.isAdminLoggedIn()).toBeFalse();
    });
  });

  describe('getUserEmail', () => {
    it('should return the user email from localStorage', () => {
      const email = 'user@example.com';
      localStorage.setItem('userEmail', email);
      expect(service.getUserEmail()).toBe(email);
    });

    it('should return null if userEmail is not present', () => {
      localStorage.removeItem('userEmail');
      expect(service.getUserEmail()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return the authToken if present', () => {
      localStorage.setItem('authToken', 'auth-token');
      expect(service.getToken()).toBe('auth-token');
    });

    it('should return the adminToken if authToken is not present', () => {
      localStorage.setItem('adminToken', 'admin-token');
      expect(service.getToken()).toBe('admin-token');
    });

    it('should return null if neither authToken nor adminToken is present', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      expect(service.getToken()).toBeNull();
    });
  });
});
