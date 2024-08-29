import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-edit-product.component.html',
  styleUrls: ['./admin-edit-product.component.css']
})
export class AdminEditProductComponent implements OnInit {
  products: any[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  fadeOut = false;

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          editing: false
        }));
      },
      error: (err) => {
        this.showMessage('Error fetching products: ' + err.message, 'error');
      }
    });
  }

  editProduct(product: any): void {
    product.editing = true;
  }

  cancelEdit(product: any): void {
    product.editing = false;
  }

  saveProduct(product: any): void {
    this.http.put(`http://localhost:3000/api/products/${product._id}`, product).subscribe({
      next: () => {
        product.editing = false;
        this.showMessage('Product updated successfully!', 'success');
      },
      error: (err) => {
        this.showMessage('Error updating product: ' + err.message, 'error');
      }
    });
  }

  deleteProduct(productId: string): void {
    console.log('Deleting product with ID:', productId); // Add this line for debugging
  
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:3000/api/products/${productId}`).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== productId);
          this.showMessage('Product deleted successfully!', 'success');
        },
        error: (err) => {
          this.showMessage('Error deleting product: ' + err.message, 'error');
        }
      });
    }
  }
  

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    this.fadeOut = false;

    // Start fade-out after 2.5 seconds, and remove the message after 3 seconds
    setTimeout(() => {
      this.fadeOut = true;
    }, 2500);

    setTimeout(() => {
      this.message = null;
      this.messageType = null;
      this.fadeOut = false;
    }, 3000);
  }
}
