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
    // Thu hồi quyền và session
    signOut({ 
      redirect: true, 
      callbackUrl: '/login'
    })
    .then(() => {
      // Xóa thông tin người dùng từ localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Xóa thông tin từ sessionStorage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      
      // Chuyển hướng đến trang login
      window.location.href = '/login';
    })
    .catch((error) => {
      console.error('Logout error:', error);
      // Nếu có lỗi, vẫn chuyển hướng đến login
      window.location.href = '/login';
    });
  };

  // Kiểm tra xem người dùng có quyền truy cập vào trang hiện tại không
  const checkAccess = () => {
    // If not logged in and trying to access protected pages
    if (!session && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
      window.location.href = '/login';
    }
  };

  // Kiểm tra quyền truy cập khi component được mount
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