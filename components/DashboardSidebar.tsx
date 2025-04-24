import Link from 'next/link';
import styles from '@/styles/DashboardSidebar.module.css';

export default function DashboardSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Dashboard</h2>
      </div>
      <nav className={styles.nav}>
        <Link href="/dashboard" className={styles.navItem}>
          <span>📊</span> Overview
        </Link>
        <Link href="/dashboard/users" className={styles.navItem}>
          <span>👥</span> Users
        </Link>
        <Link href="/dashboard/activities" className={styles.navItem}>
          <span>📅</span> Activities
        </Link>
        <Link href="/dashboard/settings" className={styles.navItem}>
          <span>⚙️</span> Settings
        </Link>
      </nav>
    </aside>
  );
}