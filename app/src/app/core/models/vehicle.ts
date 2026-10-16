export type VehicleStatus = 'DISPONIBLE' | 'AFFECTE' | 'EN_ENTRETIEN' | 'HORS_SERVICE';
export type FuelType = 'ESSENCE' | 'DIESEL' | 'ELECTRIQUE';

export interface Vehicle {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  statut: VehicleStatus;
  typeCarburant: FuelType;
  dateAcquisition: string;
}
