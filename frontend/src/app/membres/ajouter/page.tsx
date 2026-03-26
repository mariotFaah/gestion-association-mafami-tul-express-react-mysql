// src/app/membres/ajouter/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AjouterMembre() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: '',
    telephone: '',
    adress: '',
    filiere: '',
    niveau_etude: '',
    region_origine: '',
    annee_adh: '',
    date_naiss: '',
    lieu_naiss: '',
    cin: '',
    date_cin: '',
    lieu_cin: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/membres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      setMessage('✅ Membre créé avec succès !');
      setTimeout(() => {
        router.push('/membres');
      }, 2000);
    } catch (err) {
      setMessage('❌ Erreur: ' + (err instanceof Error ? err.message : 'Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Ajouter un nouveau membre</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h2>Informations personnelles</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Sexe</label>
              <select name="sexe" value={formData.sexe} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                name="adress"
                value={formData.adress}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Informations académiques</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Filière</label>
              <input
                type="text"
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Niveau d'étude</label>
              <select name="niveau_etude" value={formData.niveau_etude} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Région d'origine</label>
              <input
                type="text"
                name="region_origine"
                value={formData.region_origine}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Année d'adhésion</label>
              <input
                type="text"
                name="annee_adh"
                placeholder="2024"
                value={formData.annee_adh}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Informations CIN (optionnel)</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Numéro CIN</label>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Date de délivrance</label>
              <input
                type="date"
                name="date_cin"
                value={formData.date_cin}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Lieu de délivrance</label>
              <input
                type="text"
                name="lieu_cin"
                value={formData.lieu_cin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {message && <div className={message.includes('✅') ? 'success' : 'error'}>{message}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Envoi en cours...' : 'Ajouter le membre'}
          </button>
          <button type="button" onClick={() => router.back()} className="cancel-btn">
            Annuler
          </button>
        </div>
      </form>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 40px;
          font-size: 2rem;
        }

        .form {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .form-section h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          margin-bottom: 8px;
          color: #555;
        }

        .form-group input,
        .form-group select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .submit-btn,
        .cancel-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn {
          background: #3498db;
          color: white;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: #95a5a6;
          color: white;
        }

        .cancel-btn:hover {
          background: #7f8c8d;
        }

        .success {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 6px;
          margin-top: 20px;
          text-align: center;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 6px;
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}