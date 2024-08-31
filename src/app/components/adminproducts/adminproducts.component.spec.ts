import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule if you use Router in your component
import { AdminproductsComponent } from './adminproducts.component'; // Adjust the import path as needed

describe('AdminproductsComponent', () => {
  let component: AdminproductsComponent;
  let fixture: ComponentFixture<AdminproductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientTestingModule, 
        RouterTestingModule, // Add RouterTestingModule if needed
        AdminproductsComponent // Add standalone component here
      ],
      providers: [] // Any additional providers can go here
    }).compileComponents();

    fixture = TestBed.createComponent(AdminproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
