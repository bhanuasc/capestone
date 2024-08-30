import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
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

  constructor(private http: HttpClient) {}

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
        name: product.name,            // Product name
        price: product.price,          // Product price
        quantity: product.quantity     // Product quantity
      })),
      totalAmount: this.totalAmount || 0,
      email: this.email || '',
      address: this.address || '',
      paymentMethod: this.paymentMethod || '',
      cardDetails: this.cardDetails || {},
      upiId: this.upiId || ''
    };

    this.http.post('http://localhost:3000/api/checkout', requestData)
      .subscribe(
        response => {
          this.showAlert('Order placed successfully!', 'success');
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
}
