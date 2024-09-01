import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutusComponent } from './aboutus.component';
import { RouterModule } from '@angular/router';

describe('AboutusComponent', () => {
  let component: AboutusComponent;
  let fixture: ComponentFixture<AboutusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusComponent,RouterModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Test that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
