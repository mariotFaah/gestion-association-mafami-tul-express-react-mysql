// src/app/membres/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  AcademicCapIcon,
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Membre } from '@/types/membre';
import { api } from '@/services/api';
import styles from './page.module.css';

export default function MembreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [membre, setMembre] = useState<Membre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Membre[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchMembre = async () => {
      try {
        const id = Number(params.id);
        const data = await api.getMembreById(id);
        setMembre(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Membre non trouvé');
        setLoading(false);
      }
    };

    fetchMembre();
  }, [params.id]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Rechercher dans tous les membres
      const allMembers = await api.getMembres();
      
      const filtered = allMembers.filter(member => {
        const searchLower = searchQuery.toLowerCase();
        return (
          member.nom?.toLowerCase().includes(searchLower) ||
          member.prenom?.toLowerCase().includes(searchLower) ||
          member.cin?.toLowerCase().includes(searchLower) ||
          member.telephone?.toLowerCase().includes(searchLower) ||
          member.adress?.toLowerCase().includes(searchLower) ||
          member.filiere?.toLowerCase().includes(searchLower) ||
          member.niveau_etude?.toLowerCase().includes(searchLower) ||
          member.region_origine?.toLowerCase().includes(searchLower) ||
          member.lieu_naiss?.toLowerCase().includes(searchLower) ||
          member.date_naiss?.includes(searchLower) ||
          member.annee_adh?.toString().includes(searchLower)
        );
      });
      
      setSearchResults(filtered);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeModal = () => {
    setShowSearchModal(false);
    clearSearch();
  };

  const navigateToMember = (id: number) => {
    router.push(`/membres/${id}`);
    closeModal();
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!membre) return <div className={styles.error}>Membre non trouvé</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/membres" className={styles.backButton}>
            <ArrowLeftIcon className={styles.iconSmall} />
            Retour à la liste
          </Link>
        </div>
        <div className={styles.headerRight}>
          <button 
            onClick={() => setShowSearchModal(true)} 
            className={styles.searchButton}
          >
            <MagnifyingGlassIcon className={styles.iconSmall} />
            Rechercher un membre
          </button>
        </div>
      </div>

      <h1 className={styles.title}>
        Fiche membre : {membre.nom} {membre.prenom}
      </h1>

      <div className={styles.card}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <UserIcon className={styles.sectionIcon} />
            Informations personnelles
          </h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Nom:</strong> 
              <span>{membre.nom}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Prénom:</strong> 
              <span>{membre.prenom}</span>
            </div>

            <div className={styles.infoItem}>
              <strong>Droit d adhesion 2026:</strong> 
              <span>{membre.droit_adhesion_2026}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Sexe:</strong> 
              <span>{membre.sexe || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Date de naissance:</strong> 
              <span>{membre.date_naiss || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Lieu de naissance:</strong> 
              <span>{membre.lieu_naiss || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Téléphone:</strong> 
              <span>{membre.telephone || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Adresse:</strong> 
              <span>{membre.adress || 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <AcademicCapIcon className={styles.sectionIcon} />
            Informations académiques
          </h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Filière:</strong> 
              <span>{membre.filiere || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Niveau d'étude:</strong> 
              <span>{membre.niveau_etude || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Année d'adhésion:</strong> 
              <span>{membre.annee_adh || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Région d'origine:</strong> 
              <span>{membre.region_origine || 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <IdentificationIcon className={styles.sectionIcon} />
            Informations CIN
          </h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Numéro CIN:</strong> 
              <span>{membre.cin || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Date de délivrance:</strong> 
              <span>{membre.date_cin || 'Non renseigné'}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Lieu de délivrance:</strong> 
              <span>{membre.lieu_cin || 'Non renseigné'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recherche */}
      {showSearchModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <MagnifyingGlassIcon className={styles.iconMedium} />
                Rechercher un membre
              </h2>
              <button onClick={closeModal} className={styles.closeButton}>
                <XMarkIcon className={styles.iconSmall} />
              </button>
            </div>
            
            <div className={styles.searchInputContainer}>
              <MagnifyingGlassIcon className={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Rechercher par nom, prénom, CIN, téléphone, adresse, filière..."
                className={styles.searchInput}
                autoFocus
              />
              {searchQuery && (
                <button onClick={clearSearch} className={styles.clearButton}>
                  <XMarkIcon className={styles.iconSmall} />
                </button>
              )}
              <button 
                onClick={handleSearch}
                className={styles.searchSubmitButton}
                disabled={isSearching}
              >
                {isSearching ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            <div className={styles.searchResults}>
              {isSearching ? (
                <div className={styles.loadingResults}>Recherche en cours...</div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className={styles.resultsCount}>
                    {searchResults.length} résultat(s) trouvé(s)
                  </div>
                  {searchResults.map((result) => (
                    <div
                      key={result.id_membre}
                      className={styles.resultItem}
                      onClick={() => navigateToMember(result.id_membre)}
                    >
                      <div className={styles.resultMain}>
                        <strong>{result.nom} {result.prenom}</strong>
                        {result.cin && (
                          <span className={styles.resultCIN}>CIN: {result.cin}</span>
                        )}
                      </div>
                      <div className={styles.resultDetails}>
                        {result.telephone && (
                          <span className={styles.resultDetail}>
                            <PhoneIcon className={styles.iconTiny} />
                            {result.telephone}
                          </span>
                        )}
                        {result.filiere && (
                          <span className={styles.resultDetail}>
                            <AcademicCapIcon className={styles.iconTiny} />
                            {result.filiere}
                          </span>
                        )}
                        {result.adress && (
                          <span className={styles.resultDetail}>
                            <MapPinIcon className={styles.iconTiny} />
                            {result.adress}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : searchQuery && !isSearching ? (
                <div className={styles.noResults}>
                  Aucun membre trouvé pour "{searchQuery}"
                </div>
              ) : (
                <div className={styles.searchHint}>
                  <MagnifyingGlassIcon className={styles.iconLarge} />
                  <p>Saisissez un terme de recherche</p>
                  <small>Nom, prénom, CIN, téléphone, adresse, filière...</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}