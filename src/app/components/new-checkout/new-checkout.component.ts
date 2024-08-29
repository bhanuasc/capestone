import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { FormsModule } from '@angular/forms';

interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-new-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './new-checkout.component.html',
  styleUrls: ['./new-checkout.component.css']
})
export class NewCheckoutComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  totalPrice: number = 0;
  gst: number = 0;
  deliveryCharges: number = 150;
  finalAmount: number = 0;
  selectedPaymentMethod: string = '';
  upiId: string = '';
  cardDetails: { cardNumber: string, cardExpiry: string, cardCvc: string } = { cardNumber: '', cardExpiry: '', cardCvc: '' };

  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  alertVisible: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCartProducts();
  }

  loadCartProducts(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        this.cartProducts = JSON.parse(storedCart);
        this.calculateTotalPrice();
      } catch (e) {
        console.error('Error parsing cart data from localStorage', e);
      }
    } else {
      console.warn('No cart data found in localStorage');
    }
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartProducts.reduce(
      (total, product) => total + (product.price * (product.quantity || 0)), 0
    );
    this.gst = this.totalPrice * 0.18;
    this.finalAmount = this.totalPrice + this.gst + this.deliveryCharges;
  }

  onPaymentMethodChange(event: any): void {
    this.selectedPaymentMethod = event.target.value;
  }

  onCheckout(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.alertMessage = 'You need to be logged in to place an order.';
      this.alertType = 'error';
      this.alertVisible = true;
      setTimeout(() => this.alertVisible = false, 3000);
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const orderDetails = {
      productDetails: this.cartProducts.map(product => ({
        name: product.name,
        price: product.price,
        quantity: product.quantity
      })),
      totalPrice: this.totalPrice,
      gst: this.gst,
      deliveryCharges: this.deliveryCharges,
      finalAmount: this.finalAmount,
      paymentMethod: this.selectedPaymentMethod,
      upiId: this.upiId,
      cardDetails: this.selectedPaymentMethod === 'card' ? this.cardDetails : undefined
    };
  
    this.http.post('http://localhost:3000/api/new-orders', orderDetails, { headers })
      .subscribe(
        response => {
          console.log('Order placed successfully:', response);
          this.alertMessage = 'Order placed successfully!';
          this.alertType = 'success';
          this.alertVisible = true;
          setTimeout(() => {
            this.alertVisible = false;
            localStorage.removeItem('cart');
            this.router.navigate(['/home']);
          }, 3000);
        },
        error => {
          console.error('Error placing order:', error);
          if (error.status === 403) {
            this.alertMessage = 'Forbidden: You do not have permission to place this order.';
          } else {
            this.alertMessage = 'Failed to place the order. Please try again.';
          }
          this.alertType = 'error';
          this.alertVisible = true;
          setTimeout(() => this.alertVisible = false, 3000);
        }
      );
  }
  
  
  
}
