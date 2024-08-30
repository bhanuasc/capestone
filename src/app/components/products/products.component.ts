import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  cart: any[] = []; // Array to hold cart items
  filteredProducts: any[] = []; // Products after filtering
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  filterMenuVisible = false;
  selectedPriceRange: string = '';
  selectedCategory: string = '';
  fadeOut = false; // New property to control the fade-out effect

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCart(); // Load cart items from localStorage
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Initialize with all products
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  addToCart(product: any): void {
    // Check stock availability
    if (product.quantity == 0) {
      this.showAlert('Product is out of stock', 'error');
      return;
    }

    // Check if the product is already in the cart
    const existingProduct = this.cart.find(p => p._id === product._id);

    if (existingProduct) {
      this.showAlert('Product already in cart', 'error');
    } else {
      // Add product to the cart
      this.cart.push(product);

      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(this.cart));

      // Show success alert
      this.showAlert('Product added to cart', 'success');
    }
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.fadeOut = false; // Reset fadeOut before showing alert

    // Ensure the element exists and use type assertion
    const alertElement = document.querySelector('.alert') as HTMLElement;
    if (alertElement) {
      // Force reflow to apply styles before starting transition
      void alertElement.offsetWidth;

      setTimeout(() => {
        this.fadeOut = true; // Start fading out after 3 seconds
      }, 3000); // Time before starting to fade out
    }
  }

  toggleFilterMenu(): void {
    this.filterMenuVisible = !this.filterMenuVisible;
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.selectedPriceRange) {
      const [minPrice, maxPrice] = this.selectedPriceRange.split('-').map(v => v === '200+' ? Infinity : parseFloat(v));
      filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    this.filteredProducts = filtered;
    this.filterMenuVisible = false; // Hide filter menu after applying
  }

  removeFilters(): void {
    this.selectedPriceRange = '';
    this.selectedCategory = '';
    this.filteredProducts = this.products; // Reset to all products
    this.filterMenuVisible = false; // Hide filter menu after resetting
  }
}
