export type VehicleStatus =
  | 'DISPONIBLE'
  | 'AFFECTE'
  | 'EN_ENTRETIEN'
  | 'HORS_SERVICE';

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  DISPONIBLE: 'Disponible',
  AFFECTE: 'Affecté',
  EN_ENTRETIEN: 'En entretien',
  HORS_SERVICE: 'Hors service',
};

export const ASSIGNMENT_STATUS_LABEL: Record<string, string> = {
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};

export const MAINTENANCE_STATUS_LABEL: Record<string, string> = {
  PLANIFIE: 'Planifié',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  ANNULE: 'Annulé',
};

export const MAINTENANCE_TYPE_LABEL: Record<string, string> = {
  PREVENTIF: 'Préventif',
  CORRECTIF: 'Correctif',
  CONTROLE_TECHNIQUE: 'Contrôle technique',
};

export const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Administrateur',
  GESTIONNAIRE: 'Gestionnaire',
  CONDUCTEUR: 'Conducteur',
};

export const FUEL_TYPE_LABEL: Record<string, string> = {
  ESSENCE: 'Essence',
  DIESEL: 'Diesel',
  ELECTRIQUE: 'Électrique',
};
