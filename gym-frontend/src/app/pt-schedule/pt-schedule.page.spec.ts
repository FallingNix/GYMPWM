import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PtSchedulePage } from './pt-schedule.page';

describe('PtSchedulePage', () => {
  let component: PtSchedulePage;
  let fixture: ComponentFixture<PtSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PtSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
