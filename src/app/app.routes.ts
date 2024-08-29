import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { AdminusersComponent } from './components/adminusers/adminusers.component';
import { AdminproductsComponent } from './components/adminproducts/adminproducts.component';
import { AuthGuard } from './auth.guard';
import { adminguardGuard } from './adminguard.guard';
import { AdminAddProductComponent } from './components/admin-add-product/admin-add-product.component';
import { AdminEditProductComponent } from './components/admin-edit-product/admin-edit-product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';


export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'aboutus', component: AboutusComponent, canActivate: [AuthGuard] },
  {path: 'admin',component:AdminloginComponent},
{ path: 'admin/login', component: AdminloginComponent },
  // { path: 'admin/products', component: AdminproductsComponent, canActivate: [adminguardGuard] },
  { path: 'admin/users', component: AdminusersComponent, canActivate: [adminguardGuard] },

  {
    path: 'admin/products',
    component: AdminproductsComponent,
    canActivate: [adminguardGuard],
    children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full' }, // Redirect to a default sub-route
      { path: 'add', component: AdminAddProductComponent },
      { path: 'edit', component: AdminEditProductComponent }
    ]
  },
];
