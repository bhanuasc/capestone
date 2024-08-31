import { Component } from '@angular/core';
import { RouterModule, RouterOutlet,Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FooterComponent } from "./components/footer/footer.component";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterModule, HomeComponent, ProductsComponent, AboutusComponent, HttpClientModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'capestoneproj';
}
