import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:3000/api/login'; // Backend login URL

  constructor(private http: HttpClient, private router: Router) {}

  // Perform login and return observable
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        // Assuming backend returns a token
        if (response.token) {
          localStorage.setItem('authToken', response.token); // Store auth token in localStorage
          localStorage.setItem('userEmail', email); // Store user email in localStorage
          this.router.navigate(['/home']); // Redirect to home or appropriate page
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(error); // Rethrow error to be handled by component
      })
    );
  }

  // Handle admin login
  adminLogin(email: string): void {
    localStorage.setItem('adminToken', 'true'); // Simulate a successful admin login
    localStorage.setItem('userEmail', email); // Store user email
    this.router.navigate(['/admin/products']); // Redirect to admin products page
  }

  // Handle regular user logout
  logout(): void {
    localStorage.removeItem('authToken'); // Clear user token
    localStorage.removeItem('userEmail'); // Clear user email
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Handle admin logout
  logoutAdmin(): void {
    localStorage.removeItem('adminToken'); // Clear admin token
    localStorage.removeItem('userEmail'); // Clear user email
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Check if a regular user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Check if an admin is logged in
  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  // Retrieve email from localStorage
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('adminToken');
  }
}
