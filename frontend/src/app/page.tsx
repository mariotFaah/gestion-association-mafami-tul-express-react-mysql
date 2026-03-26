// src/app/page.tsx
import Link from 'next/link';
import { 
  UsersIcon, 
  UserPlusIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Gestion des membres
        </h1>
        <p className={styles.heroSubtitle}>
          Gérez efficacement tous les membres de votre organisation
        </p>
        <div className={styles.heroButtons}>
          <Link href="/membres" className={styles.btnPrimary}>
            <UsersIcon className={styles.btnIcon} />
            Voir la liste
          </Link>
          <Link href="/membres/ajouter" className={styles.btnSecondary}>
            <UserPlusIcon className={styles.btnIcon} />
            Ajouter un membre
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <UsersIcon className={styles.featureIcon} />
          </div>
          <h3>Liste des membres</h3>
          <p>Consultez tous les membres et leurs informations détaillées</p>
          <Link href="/membres" className={styles.featureLink}>
            Voir la liste
            <ArrowRightIcon className={styles.linkIcon} />
          </Link>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <UserPlusIcon className={styles.featureIcon} />
          </div>
          <h3>Ajout rapide</h3>
          <p>Ajoutez de nouveaux membres en quelques secondes</p>
          <Link href="/membres/ajouter" className={styles.featureLink}>
            Ajouter un membre
            <ArrowRightIcon className={styles.linkIcon} />
          </Link>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <MagnifyingGlassIcon className={styles.featureIcon} />
          </div>
          <h3>Recherche avancée</h3>
          <p>Trouvez facilement un membre avec notre système de recherche</p>
          <Link href="/membres" className={styles.featureLink}>
            Rechercher
            <ArrowRightIcon className={styles.linkIcon} />
          </Link>
        </div>
      </div>
    </div>
  );
}