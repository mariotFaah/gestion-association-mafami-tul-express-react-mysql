// src/services/api.ts
import { Membre } from '@/types/membre';

const API_URL = 'http://localhost:5000/api';

export const api = {
  async getMembres(): Promise<Membre[]> {
    const response = await fetch(`${API_URL}/membres`);
    if (!response.ok) throw new Error('Erreur lors du chargement');
    return response.json();
  },

  async getMembreById(id: number): Promise<Membre> {
    const response = await fetch(`${API_URL}/membres/${id}`);
    if (!response.ok) throw new Error('Membre non trouvé');
    return response.json();
  }
};