import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.user).toEqual({ username: '', email: '', password: '' });
    expect(component.message).toBeNull();
    expect(component.messageType).toBeNull();
    expect(component.fadeOut).toBeFalse();
  });

  it('should set success message correctly', () => {
    component.showMessage('Signup successful!', 'success');
    expect(component.message).toBe('Signup successful!');
    expect(component.messageType).toBe('success');
  });
});
