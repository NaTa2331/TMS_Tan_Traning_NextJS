// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Header.module.css';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoIcon}>🏠</span>
             Home
          </Link>
        </div>
        <div className={styles.navItems}>
          <Link 
            href="/dashboard" 
            className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/images" 
            className={`${styles.navLink} ${isActive('/images') ? styles.active : ''}`}
          >
            Images
          </Link>
          <Link 
            href="/listitem" 
            className={`${styles.navLink} ${isActive('/images') ? styles.active : ''}`}
          >
            Items
          </Link>
        </div>
      </nav>
    </header>
  );
}