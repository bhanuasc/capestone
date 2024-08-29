import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Adjust path as needed
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const token = this.authService.getToken();
    if (token) {
      this.http.get<any[]>('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        response => {
          this.orders = response;
        },
        error => {
          this.errorMessage = 'Failed to load orders. Please try again later.';
          console.error('Error loading orders:', error);
        }
      );
    } else {
      this.errorMessage = 'User not authenticated.';
    }
  }
}
