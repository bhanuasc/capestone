import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { adminguardGuard } from './adminguard.guard'; // Ensure the correct import

describe('adminguardGuard', () => {
  let guard: adminguardGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceStub = { isAdminLoggedIn: jasmine.createSpy('isAdminLoggedIn').and.returnValue(true) };
    const routerStub = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        adminguardGuard,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerStub }
      ]
    });
    guard = TestBed.inject(adminguardGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if admin is logged in', () => {
    (authService.isAdminLoggedIn as jasmine.Spy).and.returnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('should deny activation and redirect if admin is not logged in', () => {
    (authService.isAdminLoggedIn as jasmine.Spy).and.returnValue(false);
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/login']);
  });
});
