import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, FormsModule] // Import FormsModule to handle ngModel
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a working subscription form', () => {
    // Set a mock email address
    component.userEmail = 'test@example.com';

    // Spy on the onSubscribe method
    spyOn(component, 'onSubscribe');

    // Trigger the click event on the submit button
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    // Check if onSubscribe was called with the correct email
    expect(component.onSubscribe).toHaveBeenCalledWith('test@example.com');
  });
});
