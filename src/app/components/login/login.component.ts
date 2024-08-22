import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post<LoginResponse>('http://localhost:3000/api/login', this.user)
      .subscribe(
        response => {
          console.log('Login successful', response);
          // Handle the JWT token received
          localStorage.setItem('authToken', response.token);
        },
        error => {
          console.error('Error logging in', error);
          // Log error details for further investigation
          if (error.error) {
            console.error('Error details:', error.error);
          } else {
            console.error('Error details:', error.message);
          }
        }
      );
  }
}
