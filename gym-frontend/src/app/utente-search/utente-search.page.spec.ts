import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtenteSearchPage } from './utente-search.page';

describe('UtenteSearchPage', () => {
  let component: UtenteSearchPage;
  let fixture: ComponentFixture<UtenteSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UtenteSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
