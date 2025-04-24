// components/DashboardFooter.tsx
import Link from 'next/link';
import styles from '@/styles/DashboardFooter.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <p className={styles.copyright}>© 2025 Dashboard App. All rights reserved.</p>
          <p className={styles.version}>Version 1.0.0</p>
        </div>
        
        <div className={styles.footerRight}>
          <nav className={styles.footerNav}>
            <Link href="/about" className={styles.footerLink}>About</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}