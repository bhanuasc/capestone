import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
  product = {
    name: '',
    price: 0,
    description: '',
    category: ''
  };
  message: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/products', this.product)
      .subscribe(
        (response) => {
          this.message = 'Product added successfully!';
          this.resetForm();
        },
        (error) => {
          this.message = 'Failed to add product. Please try again.';
          console.error(error);
        }
      );
  }

  resetForm() {
    this.product = {
      name: '',
      price: 0,
      description: '',
      category: ''
    };
  }
}
