import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
  product = {
    name: '',
    price: 0,
    description: '',
    category: '',
    imageUrl: ''  // Added imageUrl field
  };
  message: string | null = null;
  fadeOut = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/products', this.product)
      .subscribe(
        () => {
          this.showMessage('Product added successfully!');
          this.resetForm();
        },
        (error) => {
          this.showMessage('Failed to add product. Please try again.');
          console.error(error);
        }
      );
  }

  showMessage(message: string): void {
    this.message = message;
    this.fadeOut = false;

    // Start fade-out after 2.5 seconds, and remove the message after 3 seconds
    setTimeout(() => {
      this.fadeOut = true;
    }, 2500);

    setTimeout(() => {
      this.message = null;
      this.fadeOut = false;
    }, 3000);
  }

  resetForm() {
    this.product = {
      name: '',
      price: 0,
      description: '',
      category: '',
      imageUrl: ''  // Reset imageUrl field
    };
  }
}
