import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage(errorMessage: any) {
    throw new Error('Method not implemented.');
  }
  resetMessageAfterTimeout() {
    throw new Error('Method not implemented.');
  }
  email: string = '';
  password: string = '';
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  fadeOut = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.email && this.password) {
      // Handle successful login logic
      this.message = 'Login successful!';
      this.messageType = 'success';
    } else {
      this.message = 'Please fill in all fields.';
      this.messageType = 'error';
    }
    this.authService.login(this.email, this.password).subscribe(
      () => {
        localStorage.setItem('email', this.email);
        console.log('Email stored in localStorage:', localStorage.getItem('email'));
        
        // Login is handled within AuthService and navigation happens there
      },
      error => {
        if (error.error === 'Invalid email or password') {
          this.showMessage('The email or password is incorrect.', 'error');
        } else {
          this.showMessage('An error occurred while logging in.', 'error');
        }
      }
    );
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    this.fadeOut = false;
    setTimeout(() => {
      this.fadeOut = true;
    }, 1000);
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
      this.fadeOut = false;
    }, 2000);
  }
}
