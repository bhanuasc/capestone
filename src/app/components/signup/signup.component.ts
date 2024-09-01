import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  fadeOut = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.user.username && this.user.email && this.user.password.length >= 8) {
      // Handle successful signup logic
      this.message = 'Signup successful!';
      this.messageType = 'success';
    } else {
      this.message = 'Please fill in all fields correctly.';
      this.messageType = 'error';
    }
    this.http.post('http://localhost:3000/api/signup', this.user)
      .subscribe(
        () => {
          this.showMessage('Registered successfully!', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to login page after success
          }, 3000); // Redirect after the alert fades out
        },
        error => {
          if (error.error && error.error.details && error.error.details.includes('duplicate key error')) {
            this.showMessage('User already exists.', 'error');
          } else {
            this.showMessage('Error registering user.', 'error');
          }
        }
      );
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    this.fadeOut = false;

    // Start fade-out after 2.5 seconds, and remove the message after 3 seconds
    setTimeout(() => {
      this.fadeOut = true;
    }, 2500);

    setTimeout(() => {
      this.message = null;
      this.messageType = null;
      this.fadeOut = false;
    }, 3000);
  }
}
