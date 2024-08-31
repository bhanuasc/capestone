import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { LoginComponent } from './login.component'; // Adjust the import path as needed
import { AuthService } from '../../auth.service'; // Adjust the import path as needed
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule if needed

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule
        RouterTestingModule, // Add RouterTestingModule if needed
        LoginComponent
      ],
      providers: [
        AuthService // Provide AuthService if it's used in the component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
