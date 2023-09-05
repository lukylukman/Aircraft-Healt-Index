import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreModalComponent } from './edit-store-modal.component';

describe('EditStoreModalComponent', () => {
  let component: EditStoreModalComponent;
  let fixture: ComponentFixture<EditStoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoreModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
