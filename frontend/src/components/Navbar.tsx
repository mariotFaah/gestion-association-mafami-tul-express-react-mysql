// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  UserPlusIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/solid'; // Changé de 'outline' à 'solid' pour avoir des icônes pleines
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil', icon: HomeIcon },
    { href: '/membres', label: 'Membres', icon: UsersIcon },
    { href: '/membres/ajouter', label: 'Ajouter', icon: UserPlusIcon },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLogo}>
          <Link href="/">
            <span className={styles.logoText}>
              <UsersIcon className={styles.logoIcon} />
              Gestion Membres
            </span>
          </Link>
        </div>

        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className={styles.menuIcon} />
          ) : (
            <Bars3Icon className={styles.menuIcon} />
          )}
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{link.label}</span>
                {active && <span className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}