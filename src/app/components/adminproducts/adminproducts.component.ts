import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-adminproducts',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './adminproducts.component.html',
  styleUrl: './adminproducts.component.css'
})
export class AdminproductsComponent {
  constructor(private router: Router){}

}
