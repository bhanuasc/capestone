import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Provides a mock HTTP client
        AccountComponent         // Import standalone component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no outstanding requests are remaining
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  
  it('should handle missing user email in local storage', () => {
    localStorage.removeItem('userEmail');

    component.loadUser();

    expect(component.user).toEqual({});
    expect(component.errorMessage).toBe('No user email found in local storage.');
  });
});
