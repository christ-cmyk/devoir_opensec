export type MaintenanceType = 'PREVENTIF' | 'CORRECTIF' | 'CONTROLE_TECHNIQUE';
export type MaintenanceStatus = 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

export interface Maintenance {
  id: string;
  vehiculeId: string;
  type: MaintenanceType;
  description: string;
  datePrevue: string;
  coutEstime: number;
  coutReel?: number;
  statut: MaintenanceStatus;
}
