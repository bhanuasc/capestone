import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Correct the import

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if authenticated', () => {
    localStorage.setItem('authToken', 'token'); // Set token to simulate authenticated state
    expect(guard.canActivate()).toBeTrue();
    localStorage.removeItem('authToken'); // Clean up
  });

  it('should deny access if not authenticated', () => {
    expect(guard.canActivate()).toBeFalse();
  });
});
