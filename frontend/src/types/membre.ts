// src/types/membre.ts
export interface Membre {
  id_membre: number;
  nom: string;
  prenom: string;
  sexe: string | null;
  date_naiss: string | null;
  lieu_naiss: string | null;
  cin: string | null;
  date_cin: string | null;
  lieu_cin: string | null;
  telephone: string | null;
  adress: string | null;
  filiere: string ;
  niveau_etude: string ;
  region_origine: string ;
  annee_adh: string | null;
  droit_adhesion_2026: 'Complet' | 'Incomplet'; 

}