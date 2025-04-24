// app/dashboard/page.tsx
import DashboardSidebar from '@/components/DashboardSidebar';
import styles from '@/styles/Dashboard.module.css';



export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
       <DashboardSidebar />

       <main className={styles.mainContent}>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.topicContent}>Users</h3>
            <p className={styles.statNumber}>1,234</p>
            <p className={styles.statChange}>+12% from last month</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.topicContent}>Activities</h3>
            <p className={styles.statNumber}>567</p>
            <p className={styles.statChange}>+8% from last month</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.topicContent}>Revenue</h3>
            <p className={styles.statNumber}>$12,345</p>
            <p className={styles.statChange}>+15% from last month</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.topicContent}>Tasks</h3>
            <p className={styles.statNumber}>89</p>
            <p className={styles.statChange}>+5% from last month</p>
          </div>
        </div>

        {/* Recent Activities */}
        <section className={styles.activities}>
          <h2>Recent Activities</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>📝</span>
              <div className={styles.activityContent}>
                <p>Updated user profile</p>
                <span className={styles.activityTime}>15 minutes ago</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>👥</span>
              <div className={styles.activityContent}>
                <p>New user registered</p>
                <span className={styles.activityTime}>30 minutes ago</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>📊</span>
              <div className={styles.activityContent}>
                <p>Monthly report generated</p>
                <span className={styles.activityTime}>1 hour ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}