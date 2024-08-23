import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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


  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/signup', this.user)
      .subscribe(
        () => {
          alert('Registered successfully!');
          this.router.navigate(['/login']); // Redirect to login page after successful signup
        },
        error => {
          if (error.error && error.error.details && error.error.details.includes('duplicate key error')) {
            alert('User already exists.');
          } else {
            alert('Error registering user.');
          }
        }
      );
  }
}
