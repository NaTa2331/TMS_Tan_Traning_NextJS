// app/images/page.tsx
import BackButton from '@/components/BackButton';
import styles from '@/styles/NextScreen.module.css';
import Link from 'next/link';

export default function Images() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Image Screen!</h1>
      <div className={styles.imageContainer}>
        <Link href="/images/desktop" className={styles.imageLink}>
          <div className={styles.imageCard}>
            <h2>Desktop View →</h2>
            <p>View the desktop banner image</p>
          </div>
        </Link>

        <Link href="/images/mobile" className={styles.imageLink}>
          <div className={styles.imageCard}>
            <h2>Mobile View →</h2>
            <p>View the mobile banner image</p>
          </div>
        </Link>
      </div>

      <p>This is the main images screen. Choose a view to see different images!</p>
    </div>
  );
}