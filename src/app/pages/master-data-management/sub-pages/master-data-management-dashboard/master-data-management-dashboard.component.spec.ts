import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataManagementDashboardComponent } from './master-data-management-dashboard.component';

describe('MasterDataManagementDashboardComponent', () => {
  let component: MasterDataManagementDashboardComponent;
  let fixture: ComponentFixture<MasterDataManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataManagementDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
