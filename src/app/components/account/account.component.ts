import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MyOrdersComponent } from "../../my-orders/my-orders.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MyOrdersComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  showOrders = false; // Flag to toggle My Orders section

  // Error and success message properties
  errorMessage: string | null = null;
  successMessage: string | null = null;
  user: any = {};
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
