import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminproductsComponent } from './adminproducts.component'; // Adjust the import path as needed
import { Router } from '@angular/router';

describe('AdminproductsComponent', () => {
  let component: AdminproductsComponent;
  let fixture: ComponentFixture<AdminproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        HttpClientTestingModule, 
        RouterTestingModule, // Add RouterTestingModule
        AdminproductsComponent // Add standalone component here
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.sub-nav-item').length).toBe(2);
    expect(compiled.querySelector('a[routerLink="add"]')?.textContent).toContain('Add Product');
    expect(compiled.querySelector('a[routerLink="edit"]')?.textContent).toContain('Edit Product');
  });

  it('should contain a router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
