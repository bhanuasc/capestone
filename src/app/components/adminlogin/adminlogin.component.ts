import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.css'
})
export class AdminloginComponent {
  admin = {
    username: '',
    password: ''
  };


  constructor(private router: Router) {}

  onSubmit() {
    // Hard-coded login logic (**NOT** recommended for production)
    const validUsername = 'admin'; // Replace with your actual admin username
    const validPassword = 'admin123'; // Replace with a strong, HASHED password
  
    if (this.admin.username === validUsername &&
        this.admin.password === validPassword) {
      alert('Admin login successful');  // **Temporary for demo, remove in production**
      localStorage.setItem('adminToken', 'hardcoded-token'); // **Replace with actual token logic**
      this.router.navigate(['/admin/products']);
    } else {
      alert('Invalid admin credentials');
    }
  }

}
