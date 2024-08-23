import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Import AuthService

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

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.http.post<LoginResponse>('http://localhost:3000/api/login', this.user)
      .subscribe(
        response => {
          alert('Login successful');
          localStorage.setItem('authToken', response.token);
          this.authService.login(); // Set the login state in AuthService
          this.router.navigate(['/home']); // Redirect to home page
        },
        error => {
          if (error.error === 'Invalid email or password') {
            alert('The email or password is incorrect.');
          } else if (error.error === 'Invalid password') {
            alert('The password is incorrect.');
          } else {
            alert('An error occurred while logging in.');
          }
        }
      );

      
  }
}
