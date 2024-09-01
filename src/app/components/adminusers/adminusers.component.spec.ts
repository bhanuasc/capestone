import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminusersComponent } from './adminusers.component';

describe('AdminusersComponent', () => {
  let component: AdminusersComponent;
  let fixture: ComponentFixture<AdminusersComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Provides a mock HTTP client
        AdminusersComponent      // Import standalone component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminusersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no outstanding requests are remaining
  });

  // 1. Test if the component is created
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
