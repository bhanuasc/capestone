import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: any = {};
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.errorMessage = 'No user email found in local storage.';
      return;
    }

    // Fetch user details using email
    this.http.get<any>(`http://localhost:3000/api/user?email=${email}`).subscribe(
      (data) => {
        // Log the data for debugging
        console.log('User data:', data);
        this.user = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load user details.';
        console.error('Error fetching user details:', error);
      }
    );
  }
}
