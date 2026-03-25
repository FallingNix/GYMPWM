import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPTPage } from './dashboard-pt.page';

describe('DashboardPTPage', () => {
  let component: DashboardPTPage;
  let fixture: ComponentFixture<DashboardPTPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPTPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
