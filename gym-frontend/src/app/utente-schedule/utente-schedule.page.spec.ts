import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtenteSchedulePage } from './utente-schedule.page';

describe('UtenteSchedulePage', () => {
  let component: UtenteSchedulePage;
  let fixture: ComponentFixture<UtenteSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UtenteSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
