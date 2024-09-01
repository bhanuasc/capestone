import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminloginComponent } from './adminlogin.component';

describe('AdminloginComponent', () => {
  let component: AdminloginComponent;
  let fixture: ComponentFixture<AdminloginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminloginComponent, FormsModule],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminloginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize admin object with empty username and password', () => {
    expect(component.admin.username).toBe('');
    expect(component.admin.password).toBe('');
  });

  it('should navigate to /admin/products on valid credentials', () => {
    component.admin.username = 'admin';
    component.admin.password = 'admin123';
    
    spyOn(window, 'alert');
    
    component.onSubmit();
    
    expect(window.alert).toHaveBeenCalledWith('Admin login successful');
    expect(localStorage.getItem('adminToken')).toBe('hardcoded-token');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
  });

});
