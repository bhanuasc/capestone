import { Component } from '@angular/core';
import { AdminSubNavbarComponent } from '../admin-sub-navbar/admin-sub-navbar.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-adminproducts',
  standalone: true,
  imports: [AdminSubNavbarComponent,RouterOutlet,RouterModule],
  templateUrl: './adminproducts.component.html',
  styleUrl: './adminproducts.component.css'
})
export class AdminproductsComponent {
  constructor(private router: Router){}

}
