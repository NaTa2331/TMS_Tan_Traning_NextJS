// components/DashboardLink.tsx
import Link from 'next/link';
import styles from '@/styles/DashboardLink.module.css';

export default function DashboardLink() {
  return (
    <Link href="/dashboard" className={styles.link}>
      <span className={styles.icon}>📊</span>
      <span className={styles.text}>Dashboard</span>
    </Link>
  );
}