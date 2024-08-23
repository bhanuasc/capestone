import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  // Handle regular user login
  login() {
    localStorage.setItem('authToken', 'true'); // Simulate a successful user login
    this.router.navigate(['/home']); // Redirect to home page
  }

  // Handle admin login
  adminLogin() {
    localStorage.setItem('adminToken', 'true'); // Simulate a successful admin login
    this.router.navigate(['/admin/products']); // Redirect to admin products page
  }

  // Handle regular user logout
  logout() {
    localStorage.removeItem('authToken'); // Clear user token
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Handle admin logout
  logoutAdmin() {
    localStorage.removeItem('adminToken'); // Clear admin token
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
}
