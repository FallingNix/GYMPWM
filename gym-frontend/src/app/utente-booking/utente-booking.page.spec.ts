import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtenteBookingPage } from './utente-booking.page';

describe('UtenteBookingPage', () => {
  let component: UtenteBookingPage;
  let fixture: ComponentFixture<UtenteBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UtenteBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
