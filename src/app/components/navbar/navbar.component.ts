import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public authService: AuthService ,private router: Router) {}

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout(); // Perform logout and redirect to login page
    }
  }
  adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logoutAdmin(); // Clear admin session and redirect to admin login
      this.router.navigate(['/login']);
    }
  }

  
}
