import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('affiche le formulaire de connexion', async () => {
    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#login-email')).toBeTruthy();
    expect(element.querySelector('#login-password')).toBeTruthy();
  });

  it('refuse une soumission vide', async () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    await fixture.whenStable();
    await (component as unknown as { submit: () => Promise<void> }).submit();
    fixture.detectChanges();
    expect((component as unknown as { error: () => string }).error()).toBe(
      'Identifiants invalides'
    );
  });
});
