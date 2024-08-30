import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartProducts: any[] = [];
  totalAmount: number = 0;
  email: string = '';
  address: string = '';
  paymentMethod: string = '';
  cardDetails = { cardNumber: '', cardExpiry: '', cardCVV: '' };
  upiId: string = '';
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  alertVisible: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadUserEmail(); // Ensure email is loaded on initialization
  }

  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartProducts = JSON.parse(savedCart);
      this.calculateTotalAmount();
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartProducts.reduce((acc, product) => acc + (product.price * (product.quantity || 1)), 0);
  }

  loadUserEmail(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.email = email;
    } else {
      console.error('No email found in localStorage');
    }
  }

  onPaymentMethodChange(method: string): void {
    this.paymentMethod = method;
  }

  checkout(): void {
    const requestData = {
      cartProducts: this.cartProducts.map(product => ({
        productId: product._id, // Changed _id to productId to match server-side code
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1
      })),
      totalAmount: this.totalAmount || 0,
      email: this.email || '',
      address: this.address || '',
      paymentMethod: this.paymentMethod || '',
      cardDetails: this.cardDetails || {},
      upiId: this.upiId || ''
    };

    console.log('Sending request data:', requestData); // Log request data for debugging

    this.http.post('http://localhost:3000/api/checkout', requestData)
      .subscribe(
        response => {
          this.showAlert('Order placed successfully!', 'success');
          this.clearCart(); // Clear the cart after successful checkout
          this.router.navigate(['/order-success']); // Redirect to a success page or dashboard
        },
        error => {
          console.error('Error placing order:', error);
          this.showAlert('Error placing order. Please try again.', 'error');
        }
      );
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
      this.alertVisible = false;
    }, 3000);
  }

  clearCart(): void {
    localStorage.removeItem('cart'); // Remove cart from local storage
    this.cartProducts = []; // Clear the cartProducts array
  }
}
