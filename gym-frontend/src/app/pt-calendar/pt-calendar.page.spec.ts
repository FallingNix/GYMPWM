import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PtCalendarPage } from './pt-calendar.page';

describe('PtCalendarPage', () => {
  let component: PtCalendarPage;
  let fixture: ComponentFixture<PtCalendarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PtCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
