import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  // Handle regular user login
// In AuthService
login(email: string, token: string): void {
  localStorage.setItem('email', email); // Store email
  localStorage.setItem('authToken', token); // Store token
  this.router.navigate(['/home']); // Redirect to home page
}


  // Handle admin login
  adminLogin(email: string): void {
    localStorage.setItem('adminToken', 'true'); // Simulate a successful admin login
    localStorage.setItem('userEmail', email);  // Store user email
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
    this.router.navigate(['/login']); // Redirect to plain login page
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
