import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VehicleList } from './vehicle-list';
import { VehicleService } from '../../core/services/vehicle.service';

describe('VehicleList', () => {
  let vehicles: VehicleService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [VehicleList],
      providers: [provideRouter([])],
    }).compileComponents();
    vehicles = TestBed.inject(VehicleService);
  });

  afterEach(() => localStorage.clear());

  const seed = () =>
    vehicles.create({
      immatriculation: 'AB-123-CD',
      marque: 'Renault',
      modele: 'Master',
      annee: 2022,
      kilometrage: 1000,
      statut: 'DISPONIBLE',
      typeCarburant: 'DIESEL',
      dateAcquisition: '2022-01-01',
    });

  it('affiche les véhicules existants', async () => {
    seed();
    const fixture = TestBed.createComponent(VehicleList);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('AB-123-CD');
  });

  it('filtre par immatriculation', async () => {
    seed();
    vehicles.create({
      immatriculation: 'ZZ-999-ZZ',
      marque: 'Peugeot',
      modele: 'Partner',
      annee: 2021,
      kilometrage: 2000,
      statut: 'DISPONIBLE',
      typeCarburant: 'ESSENCE',
      dateAcquisition: '2021-01-01',
    });
    const fixture = TestBed.createComponent(VehicleList);
    const component = fixture.componentInstance as unknown as {
      query: { set: (value: string) => void };
    };
    component.query.set('AB-123');
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('AB-123-CD');
    expect(element.textContent).not.toContain('ZZ-999-ZZ');
  });
});
