import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubNavbarComponent } from './admin-sub-navbar.component';

describe('AdminSubNavbarComponent', () => {
  let component: AdminSubNavbarComponent;
  let fixture: ComponentFixture<AdminSubNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSubNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
