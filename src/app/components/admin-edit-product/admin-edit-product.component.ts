import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './admin-edit-product.component.html',
  styleUrls: ['./admin-edit-product.component.css']
})
export class AdminEditProductComponent implements OnInit {
  products: any[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' | null = null; // To determine the type of alert

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
        this.message = 'Error fetching products: ' + err.message;
        this.messageType = 'error';
        this.showAlert();
      }
    });
  }

  editProduct(product: any): void {
    product.editing = true;
  }

  saveProduct(product: any): void {
    this.http.put(`http://localhost:3000/api/products/${product._id}`, product).subscribe(
      () => {
        this.message = 'Product updated successfully!';
        this.messageType = 'success';
        product.editing = false;
        this.loadProducts();
        this.showAlert();
      },
      (error) => {
        this.message = 'Failed to update product. Please try again.';
        this.messageType = 'error';
        console.error(error);
        this.showAlert();
      }
    );
  }

  cancelEdit(product: any): void {
    product.editing = false;
    this.loadProducts(); // Reload to revert changes if cancel is clicked
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:3000/api/products/${id}`).subscribe(
        () => {
          this.message = 'Product deleted successfully!';
          this.messageType = 'success';
          this.loadProducts();
          this.showAlert();
        },
        (error) => {
          this.message = 'Failed to delete product. Please try again.';
          this.messageType = 'error';
          console.error(error);
          this.showAlert();
        }
      );
    }
  }

  showAlert(): void {
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 2000);
  }
}
