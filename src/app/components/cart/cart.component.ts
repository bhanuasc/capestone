import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: any[] = [];
  totalAmount = 0;
  totalQuantity = 0;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  alertVisible: boolean | undefined;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartProducts = JSON.parse(savedCart);
      this.cartProducts.forEach(product => {
        if (product.quantity === undefined) {
          product.quantity = 1;
        }
      });
      this.calculateTotalAmount();
      this.calculateTotalQuantity();
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartProducts.reduce((acc, product) => acc + product.price * (product.quantity || 0), 0);
  }

  calculateTotalQuantity(): void {
    this.totalQuantity = this.cartProducts.reduce((acc, product) => acc + (product.quantity || 0), 0);
  }

  removeFromCart(productId: string): void {
    const productIndex = this.cartProducts.findIndex(p => p._id === productId);
    if (productIndex > -1) {
      this.cartProducts.splice(productIndex, 1);
      localStorage.setItem('cart', JSON.stringify(this.cartProducts));
      this.calculateTotalAmount();
      this.calculateTotalQuantity();
      this.showAlert('Item removed from cart', 'success');
    }
  }

  increaseQuantity(product: any): void {
    product.quantity = (product.quantity || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
    this.calculateTotalAmount();
    this.calculateTotalQuantity();
  }

  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(this.cartProducts));
      this.calculateTotalAmount();
      this.calculateTotalQuantity();
    }
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
      this.alertVisible = false;
    }, 3000); // 3 seconds
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}