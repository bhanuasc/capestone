import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
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
  email: string = '';
  password: string = '';
  user = { email: '', password: '' };
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  fadeOut = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

 // In LoginComponent
onSubmit() {
  this.http.post<LoginResponse>('http://localhost:3000/api/login', this.user)
    .subscribe(
      response => {
        console.log('Storing email:', this.email); // Debug line
        localStorage.setItem('email', this.email); // Store email
        localStorage.setItem('authToken', response.token); // Store token
        this.authService.login(this.email, response.token);

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
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
