import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardUtentePage } from './dashboard-utente.page';

describe('DashboardUtentePage', () => {
  let component: DashboardUtentePage;
  let fixture: ComponentFixture<DashboardUtentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUtentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
