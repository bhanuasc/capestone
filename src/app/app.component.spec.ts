import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { Routes } from '@angular/router'; // Adjust the path as needed
import { routes } from './app.routes';
import { adminguardGuard } from './adminguard.guard';
import { AuthGuard } from './auth.guard';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { AccountComponent } from './components/account/account.component';
import { AdminAddProductComponent } from './components/admin-add-product/admin-add-product.component';
import { AdminEditProductComponent } from './components/admin-edit-product/admin-edit-product.component';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { AdminproductsComponent } from './components/adminproducts/adminproducts.component';
import { AdminusersComponent } from './components/adminusers/adminusers.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes), // Use routes from your routing module
        AppComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    router.initialNavigation();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a route for login', () => {
    const route = router.config.find(r => r.path === 'login');
    expect(route).toBeDefined();
    expect(route?.component).toBe(LoginComponent);
  });

  it('should have a route for signup', () => {
    const route = router.config.find(r => r.path === 'signup');
    expect(route).toBeDefined();
    expect(route?.component).toBe(SignupComponent);
  });

  it('should redirect empty path to signup', () => {
    const route = router.config.find(r => r.path === '');
    expect(route).toBeDefined();
    expect(route?.redirectTo).toBe('signup');
  });

  it('should have route for home with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'home');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(HomeComponent);
  });

  it('should have route for products with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'products');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(ProductsComponent);
  });

  it('should have route for checkout with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'checkout');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(CheckoutComponent);
  });

  it('should have route for myorders with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'myorders');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(MyOrdersComponent);
  });

  it('should have route for cart with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'cart');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(CartComponent);
  });

  it('should have route for aboutus with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'aboutus');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(AboutusComponent);
  });

  it('should have route for account with AuthGuard', () => {
    const route = router.config.find(r => r.path === 'account');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
    expect(route?.component).toBe(AccountComponent);
  });

  it('should have route for admin login', () => {
    const route = router.config.find(r => r.path === 'admin/login');
    expect(route).toBeDefined();
    expect(route?.component).toBe(AdminloginComponent);
  });

  it('should have route for admin users with adminguardGuard', () => {
    const route = router.config.find(r => r.path === 'admin/users');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(adminguardGuard);
    expect(route?.component).toBe(AdminusersComponent);
  });

  it('should have route for admin products with adminguardGuard', () => {
    const route = router.config.find(r => r.path === 'admin/products');
    expect(route).toBeDefined();
    expect(route?.canActivate).toContain(adminguardGuard);
    expect(route?.component).toBe(AdminproductsComponent);

    // Check child routes
    const adminProductsRoute = route?.children?.find(r => r.path === 'add');
    expect(adminProductsRoute).toBeDefined();
    expect(adminProductsRoute?.component).toBe(AdminAddProductComponent);

    const adminProductsEditRoute = route?.children?.find(r => r.path === 'edit');
    expect(adminProductsEditRoute).toBeDefined();
    expect(adminProductsEditRoute?.component).toBe(AdminEditProductComponent);
  });
});
