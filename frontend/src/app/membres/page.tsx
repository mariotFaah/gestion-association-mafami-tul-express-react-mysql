// src/app/membres/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  UserGroupIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Membre } from '@/types/membre';
import { api } from '@/services/api';
import styles from './page.module.css';

export default function MembresPage() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [filteredMembres, setFilteredMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    filiere: '',
    niveau_etude: '',
    region_origine: ''
  });

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const data = await api.getMembres();
        setMembres(data);
        setFilteredMembres(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchMembres();
  }, []);

  // Fonction de recherche et filtrage
  useEffect(() => {
    let results = [...membres];

    // Recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(membre => 
        membre.nom?.toLowerCase().includes(query) ||
        membre.prenom?.toLowerCase().includes(query) ||
        membre.cin?.toLowerCase().includes(query) ||
        membre.telephone?.toLowerCase().includes(query) ||
        membre.adress?.toLowerCase().includes(query) ||
        membre.filiere?.toLowerCase().includes(query) ||
        membre.niveau_etude?.toLowerCase().includes(query) ||
        membre.region_origine?.toLowerCase().includes(query) ||
        membre.lieu_naiss?.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (filters.filiere) {
      results = results.filter(membre => membre.filiere === filters.filiere);
    }
    if (filters.niveau_etude) {
      results = results.filter(membre => membre.niveau_etude === filters.niveau_etude);
    }
    if (filters.region_origine) {
      results = results.filter(membre => membre.region_origine === filters.region_origine);
    }

    setFilteredMembres(results);
  }, [searchQuery, filters, membres]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const resetFilters = () => {
    setFilters({
      filiere: '',
      niveau_etude: '',
      region_origine: ''
    });
    setShowFilters(false);
  };

  // Extraire les valeurs uniques pour les filtres
  const uniqueFilieres = [...new Set(membres.map(m => m.filiere).filter(Boolean))];
  const uniqueNiveaux = [...new Set(membres.map(m => m.niveau_etude).filter(Boolean))];
  const uniqueRegions = [...new Set(membres.map(m => m.region_origine).filter(Boolean))];

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Erreur: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <UserGroupIcon className={styles.titleIcon} />
          Liste des Membres
        </h1>
        <div className={styles.stats}>
          {filteredMembres.length} membre(s) trouvé(s)
        </div>
      </div>

      {/* Barre de recherche */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, prénom, CIN, téléphone, adresse, filière..."
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={clearSearch} className={styles.clearButton}>
              <XMarkIcon className={styles.iconSmall} />
            </button>
          )}
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
          >
            <FunnelIcon className={styles.iconSmall} />
            Filtres
          </button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filtersGrid}>
              <div className={styles.filterGroup}>
                <label>Filière</label>
                <select 
                  value={filters.filiere} 
                  onChange={(e) => setFilters({...filters, filiere: e.target.value})}
                  className={styles.filterSelect}
                >
                  <option value="">Toutes les filières</option>
                  {uniqueFilieres.map(filiere => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Niveau d'étude</label>
                <select 
                  value={filters.niveau_etude} 
                  onChange={(e) => setFilters({...filters, niveau_etude: e.target.value})}
                  className={styles.filterSelect}
                >
                  <option value="">Tous les niveaux</option>
                  {uniqueNiveaux.map(niveau => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Région d'origine</label>
                <select 
                  value={filters.region_origine} 
                  onChange={(e) => setFilters({...filters, region_origine: e.target.value})}
                  className={styles.filterSelect}
                >
                  <option value="">Toutes les régions</option>
                  {uniqueRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterActions}>
                <button onClick={resetFilters} className={styles.resetButton}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      {filteredMembres.length === 0 ? (
        <div className={styles.noResults}>
          <MagnifyingGlassIcon className={styles.noResultsIcon} />
          <p>Aucun membre ne correspond à votre recherche</p>
          <button onClick={clearSearch} className={styles.clearSearchButton}>
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredMembres.map((membre) => (
            <div key={membre.id_membre} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.name}>
                  {membre.nom} {membre.prenom}
                </h3>
                {membre.cin && (
                  <span className={styles.cinBadge}>CIN: {membre.cin}</span>
                )}
              </div>
              
              <div className={styles.info}>
                <div className={styles.infoRow}>
                  <strong>Téléphone:</strong> 
                  <span>{membre.telephone || 'Non renseigné'}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Filière:</strong> 
                  <span>{membre.filiere || 'Non renseigné'}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Niveau:</strong> 
                  <span>{membre.niveau_etude || 'Non renseigné'}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Région:</strong> 
                  <span>{membre.region_origine || 'Non renseigné'}</span>
                </div>
                {membre.adress && (
                  <div className={styles.infoRow}>
                    <strong>Adresse:</strong> 
                    <span className={styles.address}>{membre.adress}</span>
                  </div>
                )}
              </div>
              
              <Link href={`/membres/${membre.id_membre}`} className={styles.button}>
                Voir fiche complète
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}