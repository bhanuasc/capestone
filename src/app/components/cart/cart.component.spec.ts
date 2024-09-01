import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CartComponent // Import the standalone component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Check if component is created successfully
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  // 3. Check if loadCart method correctly initializes cartProducts
  it('should correctly load cart from localStorage', () => {
    const mockCart = [
      { _id: '1', price: 10, quantity: 2 },
      { _id: '2', price: 20 }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCart));
    component.loadCart();
    expect(component.cartProducts.length).toBe(2);
    expect(component.cartProducts[1].quantity).toBe(1); // Default quantity should be 1
  });

  // 4. Check if checkout method navigates to checkout if cart is not empty
  it('should navigate to checkout if cart is not empty', () => {
    spyOn(component['router'], 'navigate'); // Spy on router's navigate method
    component.cartProducts = [{ _id: '1', price: 10, quantity: 1 }];
    component.checkout();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/checkout']);
  });

  // 5. Check if showAlert sets alert properties correctly
  it('should set alert properties correctly when showAlert is called', () => {
    component.showAlert('Test message', 'success');
    expect(component.alertMessage).toBe('Test message');
    expect(component.alertType).toBe('success');
    expect(component.alertVisible).toBeTrue();
  });
});
