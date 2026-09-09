export type SituationCategory =
  | 'conflict'
  | 'assertiveness'
  | 'relationship'
  | 'work'
  | 'other';

export type SituationStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface Situation {
  id: number;
  title: string;
  description: string | null;
  category: SituationCategory;
  status: SituationStatus;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface SituationListResponse {
  items: Situation[];
  page: number;
  page_size: number;
  total: number;
}

export interface CreateSituationInput {
  title: string;
  description: string;
  category: SituationCategory;
  status: SituationStatus;
}

export const categoryLabels: Record<SituationCategory, string> = {
  conflict: 'Conflit',
  assertiveness: 'Affirmation de soi',
  relationship: 'Relation',
  work: 'Travail',
  other: 'Autre',
};

export const statusLabels: Record<SituationStatus, string> = {
  draft: 'Brouillon',
  active: 'Active',
  completed: 'Terminée',
  archived: 'Archivée',
};
