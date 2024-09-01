import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  someProperty(someProperty: any) {
    throw new Error('Method not implemented.');
  }
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  methodName() {
    throw new Error('Method not implemented.');
  }
  orders: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:3000/api/orders/email?email=${email}`)
        .subscribe(
          response => {
            this.orders = response;
            console.log('Orders loaded:', this.orders);
          },
          error => {
            this.errorMessage = 'Failed to load orders. Please try again later.';
            console.error('Error loading orders:', error);
          }
        );
    } else {
      this.errorMessage = 'No email found in localStorage';
    }
  }
}
