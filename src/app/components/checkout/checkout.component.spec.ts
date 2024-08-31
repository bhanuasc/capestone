import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule if needed
import { CheckoutComponent } from './checkout.component'; // Adjust the import path as needed
import { FormsModule } from '@angular/forms'; // Import FormsModule if your component uses template-driven forms

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule
        RouterTestingModule, // Add RouterTestingModule if needed
        FormsModule, // Add FormsModule if needed
        CheckoutComponent // Import the standalone component directly
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
