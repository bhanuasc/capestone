import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../auth.service';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdminLoggedIn', 'logout', 'logoutAdmin']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, // Provides mock routing
        NavbarComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu open and closed', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should call onLogout and adminLogout methods', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog to always return true
    spyOn(component, 'onLogout').and.callThrough();
    spyOn(component, 'adminLogout').and.callThrough();

    component.onLogout();
    expect(component.onLogout).toHaveBeenCalled();

    component.adminLogout();
    expect(component.adminLogout).toHaveBeenCalled();
  });

  it('should display correct links based on authentication status', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdminLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const regularLinks = fixture.debugElement.queryAll(By.css('.navbar-nav .nav-item'));
    expect(regularLinks.length).toBeGreaterThan(0); // Check that some user links are displayed

    authService.isLoggedIn.and.returnValue(false);
    authService.isAdminLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const adminLinks = fixture.debugElement.queryAll(By.css('.navbar-nav .nav-item'));
    expect(adminLinks.length).toBeGreaterThan(0); // Check that admin links are displayed
  });
});
