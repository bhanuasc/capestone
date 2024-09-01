import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminguardGuard } from './adminguard.guard';
import { AuthService } from './auth.service';

describe('adminguardGuard', () => {
  let guard: adminguardGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        adminguardGuard,
        { provide: AuthService, useValue: { isAdminLoggedIn: jasmine.createSpy('isAdminLoggedIn') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });

    guard = TestBed.inject(adminguardGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if the user is an admin', () => {
    // Arrange
    (authService.isAdminLoggedIn as jasmine.Spy).and.returnValue(true);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to admin login if the user is not an admin', () => {
    // Arrange
    (authService.isAdminLoggedIn as jasmine.Spy).and.returnValue(false);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/login']);
  });
});
