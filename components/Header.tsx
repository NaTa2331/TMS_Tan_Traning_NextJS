// components/Header.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from '@/styles/Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    signOut({ 
      redirect: true, 
      callbackUrl: '/login'
    })
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      
      window.location.href = '/login';
    })
    .catch((error) => {
      console.error('Logout error:', error);
      window.location.href = '/login';
    });
  };

  const checkAccess = () => {
    if (!session && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
      window.location.href = '/login';
    }
  };
  useEffect(() => {
    checkAccess();
  }, [pathname, session]);

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
          {session ? (
            <>
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
                className={`${styles.navLink} ${isActive('/listitem') ? styles.active : ''}`}
              >
                Items
              </Link>
              <Link 
                href="/profile" 
                className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.logoutButton}`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}