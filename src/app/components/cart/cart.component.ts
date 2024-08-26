import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Array to hold cart items

  constructor() {}

  ngOnInit(): void {
    // Load cart from local storage
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item._id !== productId);
    // Update local storage
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
}
