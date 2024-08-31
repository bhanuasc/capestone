import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { MyOrdersComponent } from './my-orders.component'; // Adjust the import path as needed
import { AuthService } from '../auth.service'; // Adjust the import path as needed
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule if needed

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent;
  let fixture: ComponentFixture<MyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule
        RouterTestingModule, // Add RouterTestingModule if needed
        MyOrdersComponent
      ],
      providers: [
        AuthService // Provide AuthService if it's used in the component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
