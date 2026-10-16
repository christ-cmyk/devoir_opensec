export type AssignmentStatus = 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

export interface Assignment {
  id: string;
  vehiculeId: string;
  conducteurId: string;
  dateDebut: string;
  dateFin: string;
  motif: string;
  statut: AssignmentStatus;
}
