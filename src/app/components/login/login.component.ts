import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  fadeOut = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.http.post<LoginResponse>('http://localhost:3000/api/login', this.user)
      .subscribe(
        response => {
          this.showMessage('Login successful', 'success');
          localStorage.removeItem('authToken');
          this.authService.login();

          // Redirect to home page after alert fades out
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000); // Total 3 seconds delay including fade out time
        },
        error => {
          if (error.error === 'Invalid email or password') {
            this.showMessage('The email or password is incorrect.', 'error');
          } else if (error.error === 'Invalid password') {
            this.showMessage('The password is incorrect.', 'error');
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

    // Start fade-out after 1 second (1000 ms)
    setTimeout(() => {
      this.fadeOut = true;
    }, 1000);

    // Remove message after 2 seconds total (fade-out duration)
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
      this.fadeOut = false;
    }, 2000);
  }

 
  onLogin() {
    this.authService.login(); // Call without arguments
  }
}
