import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: any[] | undefined;
  cart: any[] = []; // Array to hold cart items

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  addToCart(product: any): void {
    console.log('Adding to cart:', product);
    const existingProduct = this.cart.find(p => p._id === product._id);
    if (existingProduct) {
      alert('Product already in cart');
      console.log('Product already in cart:', existingProduct);
    } else {
      this.cart.push(product);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      alert('Product added to cart');
      console.log('Product added to cart:', this.cart);
    }
  }
  
  
}
