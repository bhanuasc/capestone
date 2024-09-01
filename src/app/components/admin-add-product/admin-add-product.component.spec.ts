import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AdminAddProductComponent } from './admin-add-product.component';

describe('AdminAddProductComponent', () => {
  let component: AdminAddProductComponent;
  let fixture: ComponentFixture<AdminAddProductComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, AdminAddProductComponent],  // Use imports array for standalone components
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddProductComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.product).toEqual({
      name: '',
      price: 0,
      description: '',
      quantity: '',
      category: '',
      imageUrl: ''
    });
    expect(component.message).toBeNull();
    expect(component.fadeOut).toBeFalse();
  });

  

})