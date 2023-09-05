import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPaginationComponent } from './footer-pagination.component';

describe('FooterPaginationComponent', () => {
  let component: FooterPaginationComponent;
  let fixture: ComponentFixture<FooterPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
